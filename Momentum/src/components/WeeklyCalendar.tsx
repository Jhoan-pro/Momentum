import { useHabits } from '../context/HabitsContext';

type DayStatus = 'completed' | 'missed' | 'today' | 'future';

interface WeekDay {
  letter: string;
  status: DayStatus;
}


const toDateString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];
};

export const WeeklyCalendar = () => {
  const { habits } = useHabits(); 

  const generateWeek = (): WeekDay[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const currentDayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; 

    const weekData: WeekDay[] = [];
    const letters = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - currentDayOfWeek + i);
      
      const dateStr = toDateString(dayDate);
      const todayStr = toDateString(today);
      
      let status: DayStatus = 'future';

      if (dateStr === todayStr) {
        status = 'today'; 
      } else if (dayDate.getTime() > today.getTime()) {
        status = 'future'; 
      } else {
        
        if (habits.length === 0) {
          status = 'missed'; // Si no hay hábitos, no cuenta como completado
        } else {
          const didCompleteAll = habits.every(h => h.history && h.history.includes(dateStr));
          status = didCompleteAll ? 'completed' : 'missed';
        }
      }

      weekData.push({ letter: letters[i], status });
    }

    return weekData;
  };

  const currentWeek = generateWeek();

  const getColorByStatus = (status: DayStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'; 
      case 'today':
        return 'border-2 border-emerald-500 text-emerald-500'; 
      case 'missed':
        return 'bg-red-500/20 text-red-500'; // días fallados
      case 'future':
      default:
        return 'bg-white/5 text-slate-400 border border-white/10'; 
    }
  };

  return (
    <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl shadow-sm backdrop-blur-md">
      {currentWeek.map((day, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">{day.letter}</span>
          <div 
            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${getColorByStatus(day.status)}`}
          >
            {day.status === 'completed' ? '✓' : ''}
            {day.status === 'missed' ? '✕' : ''}
          </div>
        </div>
      ))}
    </div>
  );
};