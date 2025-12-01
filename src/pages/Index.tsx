import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Screen = 'home' | 'game' | 'rules';
type Player = { id: string; name: string; avatar: string };

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
  const [currentCondition, setCurrentCondition] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [showRulesDialog, setShowRulesDialog] = useState(false);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const getRandomAvatar = () => {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  };

  const createRoom = () => {
    if (!playerName.trim()) return;
    const newPlayer: Player = {
      id: '1',
      name: playerName,
      avatar: getRandomAvatar()
    };
    setPlayers([newPlayer]);
    setRoomCode(generateRoomCode());
    drawCards();
    setScreen('game');
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    const newPlayer: Player = {
      id: String(players.length + 1),
      name: playerName,
      avatar: getRandomAvatar()
    };
    setPlayers([...players, newPlayer]);
    drawCards();
    setScreen('game');
  };

  const drawCards = () => {
    const randomCondition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setCurrentCondition(randomCondition);
    setCurrentAction(randomAction);
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
                <Input
                  placeholder="Код комнаты"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-lg h-14 border-2 border-purple-200 focus:border-purple-500"
                  maxLength={6}
                />
                
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

  if (screen === 'game') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setScreen('home')}
                variant="outline"
                className="border-2 border-purple-300"
              >
                <Icon name="Home" size={20} />
              </Button>
              <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-purple-300">
                <span className="text-sm text-gray-600 font-semibold">Код комнаты:</span>
                <span className="ml-2 text-2xl font-black text-purple-600">{roomCode}</span>
              </div>
            </div>
            
            <Button
              onClick={() => setShowRulesDialog(true)}
              variant="outline"
              className="border-2 border-purple-300"
            >
              <Icon name="BookOpen" className="mr-2" size={20} />
              Правила
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-purple-300">
            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="Users" size={28} className="text-purple-600" />
              Игроки ({players.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {players.map((player) => (
                <div key={player.id} className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-xl border-2 border-purple-200">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                    <AvatarFallback className={`${player.avatar} text-white font-bold text-xl`}>
                      {player.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-gray-800">{player.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            <Card className="shadow-2xl border-4 border-purple-400 bg-gradient-to-br from-purple-500 to-purple-700 transform hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="mb-4 text-6xl">🎭</div>
                <h3 className="text-2xl font-black text-white mb-4">УСЛОВИЕ</h3>
                <div className="bg-white rounded-xl p-6 shadow-lg min-h-[100px] flex items-center justify-center">
                  <p className="text-2xl font-bold text-purple-700">{currentCondition}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-4 border-pink-400 bg-gradient-to-br from-pink-500 to-orange-500 transform hover:scale-105 transition-transform">
              <CardContent className="p-8 text-center">
                <div className="mb-4 text-6xl">💥</div>
                <h3 className="text-2xl font-black text-white mb-4">ДЕЙСТВИЕ</h3>
                <div className="bg-white rounded-xl p-6 shadow-lg min-h-[100px] flex items-center justify-center">
                  <p className="text-2xl font-bold text-pink-700">{currentAction}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={drawCards}
              className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 transform hover:scale-110 transition-all shadow-2xl"
            >
              <Icon name="Shuffle" className="mr-3" size={28} />
              Новые карты
            </Button>
          </div>

          <Card className="shadow-xl border-4 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">💡</span> Подсказка
              </h3>
              <p className="text-gray-700 font-semibold">
                Комбинируйте <span className="text-purple-600 font-black">Условие</span> и{' '}
                <span className="text-pink-600 font-black">Действие</span>, затем выберите игрока, который бы смог это совершить!
              </p>
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

  return null;
}
