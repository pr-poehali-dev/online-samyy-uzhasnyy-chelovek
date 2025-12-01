import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

type Player = { id: string; name: string; avatar: string };

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

interface GameSimpleProps {
  players: Player[];
  roomCode: string;
  onBack: () => void;
  onShowRules: () => void;
}

export default function GameSimple({ players, roomCode, onBack, onShowRules }: GameSimpleProps) {
  const [currentCondition, setCurrentCondition] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const drawCards = () => {
    const randomCondition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setCurrentCondition(randomCondition);
    setCurrentAction(randomAction);
  };

  if (!currentCondition || !currentAction) {
    drawCards();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" className="border-2 border-purple-300">
              <Icon name="Home" size={20} />
            </Button>
            <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-purple-300">
              <span className="text-sm text-gray-600 font-semibold">Код комнаты:</span>
              <span className="ml-2 text-2xl font-black text-purple-600">{roomCode}</span>
            </div>
          </div>
          
          <Button onClick={onShowRules} variant="outline" className="border-2 border-purple-300">
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
    </div>
  );
}
