import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/a1712dd6-cef1-482f-9c70-73dc534c72e6';

type Tab = 'about' | 'menu' | 'gallery' | 'booking';

const MENU_CATEGORIES = [
  {
    title: 'Холодные закуски',
    items: [
      { name: 'Икра осетровая с блинами', desc: 'Белужья икра, гречневые блины, сливочное масло', price: '4 800' },
      { name: 'Тартар из оленины', desc: 'Корнишоны, каперсы, перепелиное яйцо, горчичный соус', price: '1 950' },
      { name: 'Строганина из нельмы', desc: 'Сибирская нельма, брусника, кедровое масло', price: '2 400' },
      { name: 'Студень телячий', desc: 'Томлёная телячья нога, хрен, горчица', price: '1 200' },
    ]
  },
  {
    title: 'Горячие блюда',
    items: [
      { name: 'Пожарская котлета', desc: 'Курица, белый хлеб, сливочное масло, трюфельный соус', price: '1 650' },
      { name: 'Говядина «Царский ростбиф»', desc: 'Мраморная говядина, соус из мадеры, моченые яблоки', price: '3 200' },
      { name: 'Стерлядь запечённая', desc: 'Волжская стерлядь, шампиньоны, белое вино', price: '3 800' },
      { name: 'Почки в мадере', desc: 'Телячьи почки, мадера, белые грибы, гречка', price: '1 800' },
    ]
  },
  {
    title: 'Супы',
    items: [
      { name: 'Уха царская', desc: 'Стерлядь, осётр, шафран, рюмка водки', price: '1 400' },
      { name: 'Щи суточные', desc: 'Томлёная говядина, квашеная капуста, сметана', price: '780' },
      { name: 'Солянка мясная', desc: 'Пять видов мяса, маслины, каперсы, лимон', price: '920' },
    ]
  },
  {
    title: 'Десерты',
    items: [
      { name: 'Пирожное «Птичье молоко»', desc: 'Суфле с агар-агаром, тёмный бельгийский шоколад', price: '680' },
      { name: 'Медовик «Императорский»', desc: 'Восемь слоёв, крем из сливок и сгущённого молока', price: '580' },
      { name: 'Шарлотка с антоновкой', desc: 'Антоновские яблоки, ванильное мороженое', price: '520' },
    ]
  },
];

const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', caption: 'Главный зал' },
  { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', caption: 'Интерьер ресторана' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', caption: 'Авторская кухня' },
  { url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80', caption: 'Вечерний зал' },
  { url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80', caption: 'Частный кабинет' },
  { url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', caption: 'Бар' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [activeMenuCat, setActiveMenuCat] = useState(0);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', date: '', time: '', guests: '', wishes: '' });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.guests) { setBookingError('Выберите количество гостей'); return; }
    setBookingLoading(true);
    setBookingError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Ошибка сервера'); }
      setBookingSubmitted(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Ошибка отправки. Попробуйте позже.');
    } finally {
      setBookingLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'about', label: 'О ресторане' },
    { key: 'menu', label: 'Меню' },
    { key: 'gallery', label: 'Галерея' },
    { key: 'booking', label: 'Бронирование' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-imperial-black/95 backdrop-blur-sm border-b border-gold/10 py-4' : 'py-8'}`}>
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-between">
          <button onClick={() => navigateTo('about')} className="text-left hover:opacity-80 transition-opacity">
            <p className="section-subtitle text-[0.5rem] tracking-[0.4em] mb-1 opacity-70">Ресторан</p>
            <h1 className="font-display text-2xl font-light text-gold-light tracking-wider">Golden Fork</h1>
          </button>
          <nav className="hidden md:flex items-center gap-10">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => navigateTo(tab.key)} className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}>
                {tab.label}
              </button>
            ))}
          </nav>
          <button onClick={() => navigateTo('booking')} className="imperial-btn hidden md:block">
            Забронировать
          </button>
        </div>
        <div className="md:hidden flex justify-center gap-6 mt-4 px-4">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => navigateTo(tab.key)} className={`nav-link text-[0.5rem] ${activeTab === tab.key ? 'active' : ''}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=85')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-imperial-black/30" />
        <div className="relative z-10 text-center px-4" style={{ animation: 'fade-in-slow 2s ease-out forwards' }}>
          <p className="section-subtitle tracking-[0.5em] mb-8 opacity-80">Москва · С 1998 года</p>
          <h2 className="font-display text-7xl md:text-8xl font-light text-gold-light leading-tight mb-4" style={{ fontStyle: 'italic' }}>
            Высокая<br />русская кухня
          </h2>
          <div className="divider-ornament my-6">⸻ ✦ ⸻</div>
          <p className="font-montserrat text-xs tracking-[0.3em] uppercase text-gold/70 mb-12">
            Традиции императорского стола
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigateTo('menu')} className="imperial-btn">Изучить меню</button>
            <button onClick={() => navigateTo('booking')} className="imperial-btn-filled">Забронировать стол</button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={20} className="text-gold/40" />
        </div>
      </section>

      {/* Main content */}
      <main ref={mainRef} className="max-w-6xl mx-auto px-8 py-20">

        {/* === О РЕСТОРАНЕ === */}
        {activeTab === 'about' && (
          <div>
            <div className="text-center mb-24 scroll-reveal">
              <p className="section-subtitle tracking-[0.4em] mb-4">История</p>
              <h2 className="section-title text-5xl md:text-6xl mb-8">Наследие и традиции</h2>
              <div className="ornament-line max-w-xs mx-auto mb-10">
                <span className="text-gold text-sm">✦</span>
              </div>
              <p className="font-montserrat text-sm font-light leading-loose text-muted-foreground max-w-2xl mx-auto">
                Ресторан Golden Fork открыл свои двери в 1998 году в особняке XIX века в самом сердце Москвы.
                За четверть века мы стали символом высокой русской гастрономии, сохраняя рецепты императорской
                кухни и даря гостям незабываемые впечатления.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/10 mb-24">
              {[
                { icon: 'Award' as const, title: 'Мишленовское качество', desc: 'Наши блюда отмечены высшими кулинарными наградами России и Европы' },
                { icon: 'Leaf' as const, title: 'Отборные продукты', desc: 'Фермерские поставки из лучших хозяйств Центральной России, Сибири и Дальнего Востока' },
                { icon: 'Clock' as const, title: 'Традиционные рецепты', desc: 'Восстановленные рецептуры блюд XIX века из архивов императорских поваров' },
              ].map((item, i) => (
                <div key={i} className="menu-card p-12 text-center scroll-reveal bg-background" style={{ animationDelay: `${i * 0.2}s` }}>
                  <Icon name={item.icon} size={28} className="text-gold mx-auto mb-6" />
                  <h3 className="font-display text-xl text-gold-light mb-4 font-light">{item.title}</h3>
                  <p className="text-muted-foreground text-xs font-montserrat font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
              <div className="scroll-reveal">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=700&q=80" alt="Шеф-повар" className="gallery-img w-full aspect-[4/5] object-cover" />
              </div>
              <div className="scroll-reveal">
                <p className="section-subtitle tracking-[0.4em] mb-4">Шеф-повар</p>
                <h3 className="font-display text-4xl text-gold-light font-light italic mb-2">Александр Морозов</h3>
                <p className="text-gold/60 font-montserrat text-xs tracking-widest uppercase mb-8">Бренд-шеф · 20 лет опыта</p>
                <div className="w-12 h-px bg-gold/40 mb-8" />
                <p className="text-muted-foreground text-sm font-montserrat font-light leading-loose mb-6">
                  Александр Морозов — ученик легендарного Аркадия Новикова и обладатель двух звёзд Michelin.
                  Своё мастерство он совершенствовал в Париже, Лондоне и Токио, однако сердце его всегда оставалось в России.
                </p>
                <p className="text-muted-foreground text-sm font-montserrat font-light leading-loose italic">
                  «Русская кухня — это не борщ и пельмени. Это философия, воплощённая в продукте. Я возвращаю ей утраченное величие.»
                </p>
              </div>
            </div>

            <div className="border border-gold/20 p-12 scroll-reveal">
              <div className="text-center mb-10">
                <p className="section-subtitle tracking-[0.4em] mb-3">Практическая информация</p>
                <h3 className="section-title text-4xl">Посещение ресторана</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                {[
                  { icon: 'Clock' as const, label: 'Часы работы', lines: ['Пн–Пт: 12:00 – 24:00', 'Сб–Вс: 13:00 – 01:00'] },
                  { icon: 'MapPin' as const, label: 'Адрес', lines: ['Москва, ул. Пречистенка', 'дом 17, строение 1'] },
                  { icon: 'Phone' as const, label: 'Телефон', lines: ['+7 (495) 123-45-67', '+7 (495) 123-45-68'] },
                ].map((info, i) => (
                  <div key={i}>
                    <Icon name={info.icon} size={20} className="text-gold mx-auto mb-4" />
                    <p className="section-subtitle text-[0.55rem] mb-3">{info.label}</p>
                    {info.lines.map((l, j) => <p key={j} className="font-display text-lg text-gold-light font-light">{l}</p>)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === МЕНЮ === */}
        {activeTab === 'menu' && (
          <div>
            <div className="text-center mb-16 scroll-reveal">
              <p className="section-subtitle tracking-[0.4em] mb-4">Сезонное предложение</p>
              <h2 className="section-title text-5xl md:text-6xl mb-8">Карта блюд</h2>
              <div className="ornament-line max-w-xs mx-auto"><span className="text-gold text-sm">✦</span></div>
            </div>

            <div className="flex flex-wrap justify-center gap-px mb-16 border border-gold/20">
              {MENU_CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMenuCat(i)}
                  className={`px-8 py-4 font-montserrat text-[0.6rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                    activeMenuCat === i ? 'bg-gold text-imperial-black' : 'text-gold/60 hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <div className="space-y-0">
              {MENU_CATEGORIES[activeMenuCat].items.map((item, i) => (
                <div key={i} className="menu-card flex items-start justify-between p-8 group scroll-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex-1 pr-8">
                    <h4 className="font-display text-xl text-gold-light font-light mb-2 group-hover:text-gold transition-colors duration-300">{item.name}</h4>
                    <p className="text-muted-foreground text-xs font-montserrat font-light tracking-wide">{item.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-display text-2xl text-gold font-light">{item.price}</span>
                    <p className="text-muted-foreground text-[0.55rem] font-montserrat tracking-widest uppercase mt-1">руб.</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16 scroll-reveal">
              <p className="text-muted-foreground text-xs font-montserrat font-light mb-8 tracking-wide">
                Все блюда готовятся из свежих сезонных продуктов · Цены указаны в рублях с учётом НДС
              </p>
              <button onClick={() => navigateTo('booking')} className="imperial-btn">Забронировать стол</button>
            </div>
          </div>
        )}

        {/* === ГАЛЕРЕЯ === */}
        {activeTab === 'gallery' && (
          <div>
            <div className="text-center mb-16 scroll-reveal">
              <p className="section-subtitle tracking-[0.4em] mb-4">Атмосфера</p>
              <h2 className="section-title text-5xl md:text-6xl mb-8">Галерея</h2>
              <div className="ornament-line max-w-xs mx-auto"><span className="text-gold text-sm">✦</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} className="relative group overflow-hidden scroll-reveal bg-background" style={{ animationDelay: `${i * 0.1}s` }}>
                  <img src={img.url} alt={img.caption} className="gallery-img w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-imperial-black/0 group-hover:bg-imperial-black/60 transition-all duration-500 flex items-end p-6">
                    <p className="font-display text-xl text-gold-light font-light italic opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16 scroll-reveal">
              <button onClick={() => navigateTo('booking')} className="imperial-btn">Забронировать стол</button>
            </div>
          </div>
        )}

        {/* === БРОНИРОВАНИЕ === */}
        {activeTab === 'booking' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16 scroll-reveal">
              <p className="section-subtitle tracking-[0.4em] mb-4">Резервация стола</p>
              <h2 className="section-title text-5xl md:text-6xl mb-8">Бронирование</h2>
              <div className="ornament-line max-w-xs mx-auto mb-8"><span className="text-gold text-sm">✦</span></div>
              <p className="text-muted-foreground text-xs font-montserrat font-light tracking-wide">
                Мы свяжемся с вами для подтверждения бронирования в течение 30 минут
              </p>
            </div>

            {bookingSubmitted ? (
              <div className="text-center border border-gold/30 p-16 scroll-reveal">
                <Icon name="CheckCircle" size={48} className="text-gold mx-auto mb-6" />
                <h3 className="font-display text-3xl text-gold-light font-light italic mb-4">Заявка принята</h3>
                <p className="text-muted-foreground text-sm font-montserrat font-light leading-loose">
                  Благодарим вас, {bookingForm.name}. Наш администратор свяжется с вами по номеру {bookingForm.phone} для подтверждения бронирования.
                </p>
                <div className="divider-ornament mt-8">⸻ ✦ ⸻</div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-10 scroll-reveal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="section-subtitle text-[0.5rem] mb-3 block">Ваше имя *</label>
                    <input type="text" required placeholder="Имя и фамилия" className="imperial-input"
                      value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="section-subtitle text-[0.5rem] mb-3 block">Телефон *</label>
                    <input type="tel" required placeholder="+7 (___) ___-__-__" className="imperial-input"
                      value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="section-subtitle text-[0.5rem] mb-3 block">Дата *</label>
                    <input type="date" required className="imperial-input"
                      value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="section-subtitle text-[0.5rem] mb-3 block">Время *</label>
                    <input type="time" required className="imperial-input"
                      value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="section-subtitle text-[0.5rem] mb-3 block">Количество гостей *</label>
                  <div className="flex gap-3 flex-wrap mt-2">
                    {['1–2', '3–4', '5–6', '7–10', '10+'].map(g => (
                      <button type="button" key={g}
                        onClick={() => setBookingForm({...bookingForm, guests: g})}
                        className={`font-montserrat text-[0.6rem] tracking-widest uppercase px-6 py-3 border transition-all duration-300 ${
                          bookingForm.guests === g ? 'border-gold bg-gold text-imperial-black' : 'border-gold/30 text-gold/60 hover:border-gold/60 hover:text-gold'
                        }`}
                      >{g}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="section-subtitle text-[0.5rem] mb-3 block">Особые пожелания</label>
                  <textarea placeholder="Аллергии, особый повод, предпочтения..." rows={4} className="imperial-input resize-none"
                    value={bookingForm.wishes} onChange={e => setBookingForm({...bookingForm, wishes: e.target.value})} />
                </div>

                {bookingError && (
                  <p className="text-red-500/70 text-xs font-montserrat text-center border border-red-900/30 py-3 px-4">
                    {bookingError}
                  </p>
                )}

                <div className="text-center pt-4">
                  <button type="submit" disabled={bookingLoading} className="imperial-btn-filled px-16 disabled:opacity-50">
                    {bookingLoading ? 'Отправляем...' : 'Отправить заявку'}
                  </button>
                  <p className="text-muted-foreground text-[0.55rem] font-montserrat tracking-wide mt-6">
                    Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-16 mt-10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl text-gold font-light italic tracking-wider">Golden Fork</h2>
            <p className="section-subtitle text-[0.5rem] tracking-[0.4em] mt-2 opacity-50">Ресторан высокой русской кухни</p>
          </div>
          <div className="divider-ornament mb-10 opacity-30">⸻ ✦ ⸻</div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[0.55rem] font-montserrat tracking-widest uppercase text-muted-foreground">
            <span>Москва, ул. Пречистенка, д. 17</span>
            <span>+7 (495) 123-45-67</span>
            <span>© 2024 Golden Fork</span>
          </div>
        </div>
      </footer>
    </div>
  );
}