import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import GameClassic from '@/components/GameClassic';
import GameSimple from '@/components/GameSimple';

type Screen = 'home' | 'mode-select' | 'game-classic' | 'game-simple' | 'rules';
type Player = { id: string; name: string; avatar: string; score: number };
type GameMode = 'classic' | 'simple' | null;

const API_URL = 'https://functions.poehali.dev/fb950795-3295-445d-9605-1e21f1ea6512';
const AVATAR_COLORS = ['bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

const CONDITIONS = [
  'В костюме супергероя', 'Голым', 'В пижаме', 'В деловом костюме', 'В карнавальном наряде',
  'С завязанными глазами', 'На роликах', 'В костюме клоуна', 'В купальнике', 'В маске',
  'С большим плюшевым мишкой', 'На костылях', 'В короне', 'С пустым кошельком', 'В детской одежде'
];

const ACTIONS = [
  'Испортить ребёнку мороженое', 'Украсть чужого питомца', 'Станцевать на столе', 'Спеть караоке в метро',
  'Обнять незнакомца', 'Сделать селфи с полицейским', 'Прокатиться на детской карусели', 'Съесть еду с пола',
  'Прыгнуть в фонтан', 'Разбить тарелку в ресторане', 'Поцеловать статую', 'Покормить голубей с рук',
  'Пройтись по выставочному пространству', 'Устроить флешмоб', 'Крикнуть "Я люблю тебя!" на улице',
  'Спрятаться под столом', 'Попросить автограф у прохожего', 'Станцевать с манекеном', 'Упасть в обморок',
  'Рассказать анекдот полиции', 'Предложить брак незнакомцу', 'Съесть острый перец', 'Сделать кувырок'
];

export default function Index() {
  const [screen, setScreen] = useState<Screen>('home');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [roomError, setRoomError] = useState('');

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const getRandomAvatar = () => {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  };

  const createRoom = async () => {
    if (!playerName.trim()) return;
    const code = generateRoomCode();
    const avatar = getRandomAvatar();
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', code })
      });
      
      if (!response.ok) throw new Error('Failed to create room');
      
      const joinResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', code, name: playerName, avatar })
      });
      
      if (!joinResponse.ok) throw new Error('Failed to join room');
      
      setRoomCode(code);
      await loadPlayers(code);
      setScreen('mode-select');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    setRoomError('');
    const avatar = getRandomAvatar();
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', code: roomCode, name: playerName, avatar })
      });
      
      if (!response.ok) {
        const data = await response.json();
        setRoomError(data.error || 'Комната не найдена');
        return;
      }
      
      await loadPlayers(roomCode);
      setScreen('mode-select');
    } catch (error) {
      console.error('Error joining room:', error);
      setRoomError('Комната не найдена');
    }
  };
  
  const loadPlayers = async (code: string) => {
    try {
      const response = await fetch(`${API_URL}?code=${code}`);
      if (!response.ok) throw new Error('Failed to load players');
      
      const data = await response.json();
      setPlayers(data.players || []);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };
  
  useEffect(() => {
    if (roomCode && (screen === 'mode-select' || screen === 'game-classic' || screen === 'game-simple')) {
      const interval = setInterval(() => loadPlayers(roomCode), 3000);
      return () => clearInterval(interval);
    }
  }, [roomCode, screen]);

  const selectMode = (mode: 'classic' | 'simple') => {
    setGameMode(mode);
    setScreen(mode === 'classic' ? 'game-classic' : 'game-simple');
  };

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-bounce-in">
              😈 Самый ужасный человек
            </h1>
            <p className="text-xl text-gray-700 font-semibold">
              Насколько хорошо вы знаете своих друзей?
            </p>
          </div>

          <Card className="shadow-2xl border-4 border-purple-300 animate-scale-in">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Input
                  placeholder="Ваше имя"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="text-lg h-14 border-2 border-purple-200 focus:border-purple-500"
                />
                
                <Button
                  onClick={createRoom}
                  className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
                  disabled={!playerName.trim()}
                >
                  <Icon name="Plus" className="mr-2" size={24} />
                  Создать игру
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-purple-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-semibold">или</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Код комнаты"
                    value={roomCode}
                    onChange={(e) => {
                      setRoomCode(e.target.value.toUpperCase());
                      setRoomError('');
                    }}
                    className="text-lg h-14 border-2 border-purple-200 focus:border-purple-500"
                    maxLength={6}
                  />
                  {roomError && (
                    <p className="text-sm text-red-500 mt-2 ml-2">{roomError}</p>
                  )}
                </div>
                
                <Button
                  onClick={joinRoom}
                  className="w-full h-14 text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all"
                  disabled={!playerName.trim() || !roomCode.trim()}
                >
                  <Icon name="Users" className="mr-2" size={24} />
                  Присоединиться
                </Button>
              </div>

              <Button
                onClick={() => setShowRulesDialog(true)}
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-2 border-purple-300 hover:bg-purple-50"
              >
                <Icon name="BookOpen" className="mr-2" size={20} />
                Правила игры
              </Button>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-purple-600">Правила игры</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-bold text-xl text-pink-600 mb-2">🎯 Цель игры</h3>
                <p>Общение, веселье и проверка того, насколько хорошо вы знаете друг друга!</p>
              </div>
              
              <div>
                <h3 className="font-bold text-xl text-purple-600 mb-2">🎮 Как играть</h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Соберите компанию друзей (минимум 3 человека)</li>
                  <li>Каждый ход комбинируйте карты Условия и Действия</li>
                  <li>Выберите игрока, который по вашему мнению смог бы совершить это</li>
                  <li>Если игрок согласен - он получает очко</li>
                  <li>Если отказывается - очко получаете вы</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-xl text-orange-600 mb-2">💡 Примеры</h3>
                <div className="space-y-2 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <p>• <span className="font-semibold text-purple-600">"В костюме супергероя"</span> + <span className="font-semibold text-pink-600">"Испортить ребёнку мороженое"</span></p>
                  <p>• <span className="font-semibold text-purple-600">"Голым"</span> + <span className="font-semibold text-pink-600">"Пройтись по выставочному пространству"</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl text-blue-600 mb-2">🏆 Победа</h3>
                <p>Играйте до 10 очков или просто наслаждайтесь процессом!</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (screen === 'mode-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-black text-purple-600">Выберите режим игры</h1>
            <p className="text-lg text-gray-700">Код комнаты: <span className="font-black text-purple-600">{roomCode}</span></p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="shadow-2xl border-4 border-purple-400 cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => selectMode('classic')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-7xl mb-4">🎴</div>
                <h2 className="text-3xl font-black text-purple-600">Классический</h2>
                <p className="text-gray-700 text-lg">
                  У каждого игрока 5 карт действий. Общая карта условия на столе. 
                  Все выкидывают подходящую карту, потом голосуют за самую смешную!
                </p>
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <p className="font-semibold text-purple-700">✨ Как в оригинальной игре</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-2xl border-4 border-pink-400 cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => selectMode('simple')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-7xl mb-4">🎯</div>
                <h2 className="text-3xl font-black text-pink-600">Упрощённый</h2>
                <p className="text-gray-700 text-lg">
                  Открываются случайные карты условия и действия. 
                  Игроки обсуждают, кто бы смог это сделать!
                </p>
                <div className="bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
                  <p className="font-semibold text-pink-700">⚡ Быстро и просто</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setScreen('home')}
              variant="outline"
              className="border-2 border-purple-300"
            >
              <Icon name="ArrowLeft" className="mr-2" size={20} />
              Назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'game-classic') {
    return (
      <GameClassic
        players={players}
        roomCode={roomCode}
        onBack={() => setScreen('home')}
        onShowRules={() => setShowRulesDialog(true)}
      />
    );
  }

  if (screen === 'game-simple') {
    return (
      <GameSimple
        players={players}
        roomCode={roomCode}
        onBack={() => setScreen('home')}
        onShowRules={() => setShowRulesDialog(true)}
      />
    );
  }

  return null;
}