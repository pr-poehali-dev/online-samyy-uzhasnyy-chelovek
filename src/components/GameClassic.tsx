import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

type Player = { id: string; name: string; avatar: string; score: number };

const CONDITIONS = [
  'В костюме супергероя', 'Голым', 'В пижаме', 'В деловом костюме', 'В карнавальном наряде',
  'С завязанными глазами', 'На роликах', 'В костюме клоуна', 'В купальнике', 'В маске',
  'С большим плюшевым мишкой', 'На костылях', 'В короне', 'С пустым кошельком', 'В детской одежде',
  'В свадебном платье', 'С зонтиком', 'В пиратской шляпе', 'С гитарой', 'В балетной пачке'
];

const ACTIONS = [
  'Испортить ребёнку мороженое', 'Украсть чужого питомца', 'Станцевать на столе', 'Спеть караоке в метро',
  'Обнять незнакомца', 'Сделать селфи с полицейским', 'Прокатиться на детской карусели', 'Съесть еду с пола',
  'Прыгнуть в фонтан', 'Разбить тарелку в ресторане', 'Поцеловать статую', 'Покормить голубей с рук',
  'Пройтись по выставочному пространству', 'Устроить флешмоб', 'Крикнуть "Я люблю тебя!" на улице',
  'Спрятаться под столом', 'Попросить автограф у прохожего', 'Станцевать с манекеном', 'Упасть в обморок',
  'Рассказать анекдот полиции', 'Предложить брак незнакомцу', 'Съесть острый перец', 'Сделать кувырок',
  'Покататься на тележке из магазина', 'Притвориться статуей', 'Прокричать скороговорку', 'Станцевать брейк-данс',
  'Сделать предложение руки и сердца фонарю', 'Изобразить курицу'
];

interface GameClassicProps {
  players: Player[];
  roomCode: string;
  onBack: () => void;
  onShowRules: () => void;
}

export default function GameClassic({ players: initialPlayers, roomCode, onBack, onShowRules }: GameClassicProps) {
  const [players, setPlayers] = useState(initialPlayers);
  const [currentCondition, setCurrentCondition] = useState('');
  const [playerHands, setPlayerHands] = useState<Record<string, string[]>>({});
  const [playedCards, setPlayedCards] = useState<Record<string, string>>({});
  const [gamePhase, setGamePhase] = useState<'draw' | 'play' | 'vote'>('draw');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const dealCards = () => {
    const shuffled = shuffleArray(ACTIONS);
    const hands: Record<string, string[]> = {};
    
    players.forEach((player, index) => {
      hands[player.id] = shuffled.slice(index * 5, (index + 1) * 5);
    });
    
    setPlayerHands(hands);
    drawCondition();
    setGamePhase('play');
  };

  const drawCondition = () => {
    const randomCondition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    setCurrentCondition(randomCondition);
  };

  const playCard = (card: string, playerId: string) => {
    setPlayedCards(prev => ({ ...prev, [playerId]: card }));
    setSelectedCard(card);
  };

  const submitCard = () => {
    if (Object.keys(playedCards).length === players.length) {
      setGamePhase('vote');
    }
  };

  const voteForCard = (playerId: string) => {
    setVotedFor(playerId);
  };

  const finishRound = () => {
    if (votedFor) {
      setPlayers(prev => prev.map(p => 
        p.id === votedFor ? { ...p, score: p.score + 1 } : p
      ));
    }
    
    setPlayedCards({});
    setSelectedCard(null);
    setVotedFor(null);
    setGamePhase('draw');
  };

  if (gamePhase === 'draw') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button onClick={onBack} variant="outline" className="border-2 border-purple-300">
              <Icon name="Home" size={20} />
            </Button>
            <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-purple-300">
              <span className="text-sm text-gray-600 font-semibold">Код:</span>
              <span className="ml-2 text-2xl font-black text-purple-600">{roomCode}</span>
            </div>
            <Button onClick={onShowRules} variant="outline" className="border-2 border-purple-300">
              <Icon name="BookOpen" className="mr-2" size={20} />
              Правила
            </Button>
          </div>

          <Card className="shadow-2xl border-4 border-purple-300">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-4xl font-black text-purple-600">Классический режим</h2>
              <p className="text-xl text-gray-700">Каждый игрок получит по 5 карт действий</p>
              
              <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-lg text-purple-700 mb-3">Игроки в комнате:</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${player.avatar} text-white font-bold`}>
                          {player.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold">{player.name}</span>
                      <span className="text-purple-600 font-bold">({player.score})</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={dealCards}
                className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Icon name="Play" className="mr-3" size={28} />
                Начать раунд
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === 'play') {
    const currentPlayer = players[0];
    const hand = playerHands[currentPlayer.id] || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button onClick={onBack} variant="outline" className="border-2 border-purple-300">
              <Icon name="Home" size={20} />
            </Button>
            <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-purple-300">
              <span className="text-sm text-gray-600 font-semibold">Код:</span>
              <span className="ml-2 text-2xl font-black text-purple-600">{roomCode}</span>
            </div>
          </div>

          <Card className="shadow-2xl border-4 border-purple-400 bg-gradient-to-br from-purple-500 to-purple-700">
            <CardContent className="p-8 text-center">
              <div className="mb-4 text-6xl">🎭</div>
              <h3 className="text-2xl font-black text-white mb-4">УСЛОВИЕ</h3>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <p className="text-3xl font-bold text-purple-700">{currentCondition}</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-purple-300">
            <h3 className="text-2xl font-black text-gray-800 mb-4">
              Выберите карту действия:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hand.map((action, idx) => (
                <Card
                  key={idx}
                  className={`cursor-pointer transition-all transform hover:scale-105 border-4 ${
                    selectedCard === action
                      ? 'border-pink-500 bg-gradient-to-br from-pink-100 to-orange-100'
                      : 'border-pink-300 hover:border-pink-400'
                  }`}
                  onClick={() => {
                    playCard(action, currentPlayer.id);
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">💥</div>
                    <p className="text-lg font-bold text-pink-700">{action}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedCard && (
            <div className="flex justify-center">
              <Button
                onClick={submitCard}
                className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
              >
                <Icon name="Check" className="mr-3" size={28} />
                Сыграть карту
              </Button>
            </div>
          )}

          <Card className="shadow-xl border-4 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <p className="text-gray-700 font-semibold text-center">
                💡 Выберите действие, которое лучше всего подходит к условию "{currentCondition}"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === 'vote') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button onClick={onBack} variant="outline" className="border-2 border-purple-300">
              <Icon name="Home" size={20} />
            </Button>
            <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-purple-300">
              <span className="text-sm text-gray-600 font-semibold">Код:</span>
              <span className="ml-2 text-2xl font-black text-purple-600">{roomCode}</span>
            </div>
          </div>

          <Card className="shadow-2xl border-4 border-purple-400 bg-gradient-to-br from-purple-500 to-purple-700">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-black text-white mb-4">УСЛОВИЕ</h3>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <p className="text-3xl font-bold text-purple-700">{currentCondition}</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-purple-300">
            <h3 className="text-2xl font-black text-gray-800 mb-4 text-center">
              🗳️ Голосуйте за самую смешную комбинацию!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => {
                const card = playedCards[player.id];
                if (!card) return null;
                
                return (
                  <Card
                    key={player.id}
                    className={`cursor-pointer transition-all transform hover:scale-105 border-4 ${
                      votedFor === player.id
                        ? 'border-green-500 bg-gradient-to-br from-green-100 to-green-50'
                        : 'border-pink-300 hover:border-pink-400'
                    }`}
                    onClick={() => voteForCard(player.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`${player.avatar} text-white font-bold`}>
                            {player.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-lg">{player.name}</span>
                      </div>
                      <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                        <p className="text-lg font-bold text-pink-700">{card}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {votedFor && (
            <div className="flex justify-center">
              <Button
                onClick={finishRound}
                className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Icon name="Trophy" className="mr-3" size={28} />
                Завершить раунд
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
