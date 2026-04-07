import { useState } from 'react';
import Icon from '@/components/ui/icon';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  wishes: string;
  status: BookingStatus;
  createdAt: string;
}

const MOCK_BOOKINGS: Booking[] = [
  { id: 1, name: 'Александров Михаил Петрович', phone: '+7 (916) 234-56-78', date: '2024-12-20', time: '19:00', guests: '3–4', wishes: 'Годовщина свадьбы. Прошу приготовить торт.', status: 'pending', createdAt: '2024-12-15 14:32' },
  { id: 2, name: 'Романова Елена Игоревна', phone: '+7 (903) 345-67-89', date: '2024-12-21', time: '20:30', guests: '1–2', wishes: 'Аллергия на морепродукты', status: 'confirmed', createdAt: '2024-12-15 11:10' },
  { id: 3, name: 'Воронов Дмитрий Сергеевич', phone: '+7 (985) 456-78-90', date: '2024-12-22', time: '13:00', guests: '7–10', wishes: 'Деловой ужин. Отдельный кабинет.', status: 'pending', createdAt: '2024-12-14 18:45' },
  { id: 4, name: 'Белова Анна Николаевна', phone: '+7 (926) 567-89-01', date: '2024-12-19', time: '18:00', guests: '1–2', wishes: '', status: 'cancelled', createdAt: '2024-12-13 09:22' },
  { id: 5, name: 'Князев Игорь Александрович', phone: '+7 (967) 678-90-12', date: '2024-12-23', time: '21:00', guests: '5–6', wishes: 'День рождения. Просьба украсить стол.', status: 'pending', createdAt: '2024-12-15 16:05' },
];

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'border-amber-600/50 text-amber-500 bg-amber-500/5',
  confirmed: 'border-emerald-700/50 text-emerald-500 bg-emerald-500/5',
  cancelled: 'border-red-900/50 text-red-500/70 bg-red-500/5',
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const [selected, setSelected] = useState<Booking | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const updateStatus = (id: number, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-sm px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle text-[0.5rem] tracking-[0.4em] mb-3 opacity-60">Панель управления</p>
            <h1 className="font-display text-4xl text-gold-light font-light italic">Императоръ</h1>
            <div className="w-16 h-px bg-gold/30 mx-auto mt-6" />
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div>
              <label className="section-subtitle text-[0.5rem] mb-4 block">Пароль</label>
              <input
                type="password"
                required
                placeholder="Введите пароль"
                className={`imperial-input ${passwordError ? 'border-red-500/50' : ''}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
              />
              {passwordError && (
                <p className="text-red-500/70 text-[0.6rem] font-montserrat mt-3 tracking-wide">
                  Неверный пароль
                </p>
              )}
            </div>
            <button type="submit" className="imperial-btn-filled w-full">
              Войти
            </button>
          </form>

          <div className="text-center mt-12">
            <a href="/" className="nav-link text-[0.55rem]">← Вернуться на сайт</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b border-gold/10 bg-imperial-dark py-5 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="section-subtitle text-[0.45rem] tracking-[0.4em] opacity-50">Панель управления</p>
              <h1 className="font-display text-xl text-gold-light font-light tracking-wider">Императоръ</h1>
            </div>
            <div className="w-px h-8 bg-gold/20" />
            <p className="font-montserrat text-[0.6rem] text-muted-foreground tracking-widest uppercase">Бронирования</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="nav-link text-[0.55rem]">Сайт ресторана</a>
            <button onClick={() => setAuthenticated(false)} className="imperial-btn py-2 text-[0.55rem] px-4">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 mb-10">
          {[
            { label: 'Всего заявок', value: stats.total, icon: 'BookOpen' as const },
            { label: 'Ожидают ответа', value: stats.pending, icon: 'Clock' as const },
            { label: 'Подтверждено', value: stats.confirmed, icon: 'CheckCircle' as const },
            { label: 'Отменено', value: stats.cancelled, icon: 'XCircle' as const },
          ].map((s, i) => (
            <div key={i} className="bg-background p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="section-subtitle text-[0.5rem] opacity-60">{s.label}</p>
                <Icon name={s.icon} size={16} className="text-gold/40" />
              </div>
              <p className="font-display text-4xl text-gold-light font-light">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex gap-px border border-gold/20 mb-6 w-fit">
              {([['all', 'Все'], ['pending', 'Ожидают'], ['confirmed', 'Подтверждены'], ['cancelled', 'Отменены']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-5 py-3 font-montserrat text-[0.55rem] tracking-widest uppercase transition-all duration-200 ${
                    filter === key ? 'bg-gold text-imperial-black' : 'text-gold/50 hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Booking rows */}
            <div className="space-y-0">
              {filtered.length === 0 ? (
                <div className="border border-gold/10 p-12 text-center">
                  <p className="text-muted-foreground font-montserrat text-xs">Заявок не найдено</p>
                </div>
              ) : (
                filtered.map(booking => (
                  <div
                    key={booking.id}
                    onClick={() => setSelected(booking)}
                    className={`border-b border-gold/10 p-6 cursor-pointer transition-all duration-200 hover:bg-gold/3 ${
                      selected?.id === booking.id ? 'bg-gold/5 border-l-2 border-l-gold' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-lg text-gold-light font-light">{booking.name}</h3>
                          <span className={`status-badge border ${STATUS_STYLES[booking.status]}`}>
                            {STATUS_LABELS[booking.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-muted-foreground">
                          <span className="flex items-center gap-2 font-montserrat text-[0.6rem] tracking-wide">
                            <Icon name="Calendar" size={12} className="text-gold/40" />
                            {booking.date} в {booking.time}
                          </span>
                          <span className="flex items-center gap-2 font-montserrat text-[0.6rem] tracking-wide">
                            <Icon name="Users" size={12} className="text-gold/40" />
                            {booking.guests} гостей
                          </span>
                          <span className="flex items-center gap-2 font-montserrat text-[0.6rem] tracking-wide">
                            <Icon name="Phone" size={12} className="text-gold/40" />
                            {booking.phone}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-montserrat text-[0.5rem] tracking-wide flex-shrink-0 ml-4">
                        {booking.createdAt}
                      </p>
                    </div>
                    {booking.wishes && (
                      <p className="mt-3 text-muted-foreground font-montserrat text-[0.6rem] font-light italic border-l border-gold/20 pl-4">
                        {booking.wishes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            {selected ? (
              <div className="border border-gold/20 p-8 sticky top-8">
                <div className="flex items-center justify-between mb-8">
                  <p className="section-subtitle text-[0.5rem] tracking-[0.3em]">Заявка #{selected.id}</p>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-gold transition-colors">
                    <Icon name="X" size={16} />
                  </button>
                </div>

                <h2 className="font-display text-2xl text-gold-light font-light italic mb-1">{selected.name}</h2>
                <p className="text-gold/50 font-montserrat text-[0.6rem] tracking-widest uppercase mb-8">
                  {STATUS_LABELS[selected.status]}
                </p>

                <div className="space-y-5 mb-8">
                  {[
                    { icon: 'Phone' as const, label: 'Телефон', value: selected.phone },
                    { icon: 'Calendar' as const, label: 'Дата и время', value: `${selected.date} в ${selected.time}` },
                    { icon: 'Users' as const, label: 'Гости', value: `${selected.guests} чел.` },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Icon name={info.icon} size={14} className="text-gold/40 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground font-montserrat text-[0.5rem] tracking-widest uppercase mb-0.5">{info.label}</p>
                        <p className="font-montserrat text-xs text-gold-light/80">{info.value}</p>
                      </div>
                    </div>
                  ))}

                  {selected.wishes && (
                    <div>
                      <p className="text-muted-foreground font-montserrat text-[0.5rem] tracking-widest uppercase mb-2">Пожелания</p>
                      <p className="font-montserrat text-xs text-muted-foreground font-light leading-relaxed italic border-l border-gold/20 pl-3">
                        {selected.wishes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="divider-ornament opacity-20 mb-8">⸻</div>

                <div className="space-y-3">
                  <p className="section-subtitle text-[0.5rem] tracking-[0.3em] mb-4">Изменить статус</p>
                  {selected.status !== 'confirmed' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'confirmed')}
                      className="imperial-btn-filled w-full text-[0.6rem]"
                    >
                      Подтвердить бронирование
                    </button>
                  )}
                  {selected.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'cancelled')}
                      className="w-full border border-red-900/40 text-red-500/60 font-montserrat text-[0.6rem] tracking-widest uppercase py-3 hover:bg-red-500/5 hover:border-red-900/60 transition-all duration-300"
                    >
                      Отменить
                    </button>
                  )}
                  {selected.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(selected.id, 'pending')}
                      className="w-full border border-gold/20 text-gold/50 font-montserrat text-[0.6rem] tracking-widest uppercase py-3 hover:border-gold/40 hover:text-gold/70 transition-all duration-300"
                    >
                      Вернуть в ожидание
                    </button>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gold/10">
                  <p className="text-muted-foreground font-montserrat text-[0.5rem] tracking-wide">
                    Заявка получена: {selected.createdAt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-gold/10 p-12 text-center">
                <Icon name="MousePointerClick" size={32} className="text-gold/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-montserrat text-xs font-light">
                  Выберите заявку для просмотра подробностей
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
