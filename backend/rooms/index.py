import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление игровыми комнатами
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create':
                room_code = body_data.get('code')
                cur.execute(
                    "INSERT INTO rooms (code) VALUES (%s) RETURNING id",
                    (room_code,)
                )
                room_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'room_id': room_id, 'code': room_code})
                }
            
            elif action == 'join':
                room_code = body_data.get('code')
                player_name = body_data.get('name')
                avatar = body_data.get('avatar')
                
                cur.execute("SELECT id FROM rooms WHERE code = %s", (room_code,))
                room = cur.fetchone()
                
                if not room:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Комната не найдена'})
                    }
                
                cur.execute(
                    "INSERT INTO players (room_code, name, avatar) VALUES (%s, %s, %s) RETURNING id",
                    (room_code, player_name, avatar)
                )
                player_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True, 'player_id': player_id})
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            room_code = params.get('code')
            
            if not room_code:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Код комнаты обязателен'})
                }
            
            cur.execute(
                "SELECT id, name, avatar, score FROM players WHERE room_code = %s ORDER BY created_at",
                (room_code,)
            )
            
            players = []
            for row in cur.fetchall():
                players.append({
                    'id': str(row[0]),
                    'name': row[1],
                    'avatar': row[2],
                    'score': row[3]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'players': players})
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
