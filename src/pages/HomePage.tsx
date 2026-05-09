import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, Smartphone, Tv, Wind, WashingMachine, 
  CheckCircle, Shield, Trophy, ArrowLeft, ChevronRight,
  Sparkles, Bike, Laptop
} from 'lucide-react';

interface HomePageProps {
  user: { name: string; email: string; isAdmin: boolean } | null;
  onLogout: () => void;
}

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 157, 88, 0.5)';
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(15, 157, 88, ${0.2 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// Header Component
const Header = ({ user, onLogout }: HomePageProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0b0b0b]/90 backdrop-blur-xl border-b border-[#2a2a2a]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0f9d58] to-[#0a7a44] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-poppins">
              Win <span className="text-[#0f9d58]">Strike</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-[#0f9d58] transition-colors duration-300 relative group">
              ہوم
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0f9d58] transition-all duration-300 group-hover:w-full" />
            </Link>

            <a href="https://expo.dev/accounts/winstrike.info/projects/moripgc/builds/731eb338-44ae-4319-942e-495662b80019" download className="flex items-center gap-2 text-white hover:text-[#0f9d58] transition-colors duration-300 relative group">
              <Smartphone className="w-4 h-4" />
              ایپ ڈاؤنلوڈ کریں
            </a>
            {user ? (
              <>
                <Link
                  to={user.isAdmin ? '/admin' : '/dashboard'}
                  className="text-white hover:text-[#0f9d58] transition-colors duration-300"
                >
                  {user.name}
                </Link>
                <button
                  onClick={onLogout}
                  className="text-white hover:text-[#0f9d58] transition-colors duration-300"
                >
                  لاگ آؤٹ
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-[#0f9d58] transition-colors duration-300">
                  لاگ ان
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  سائن اپ
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0b0b0b]/95 backdrop-blur-xl border-t border-[#2a2a2a]">
          <nav className="flex flex-col p-4 gap-4">
            <Link to="/" className="text-white hover:text-[#0f9d58] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              ہوم
            </Link>

            <a href="https://expo.dev/accounts/winstrike.info/projects/moripgc/builds/731eb338-44ae-4319-942e-495662b80019" download className="text-white hover:text-[#0f9d58] transition-colors flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <Smartphone className="w-4 h-4" />
              ایپ ڈاؤنلوڈ کریں
            </a>
            {user ? (
              <>
                <Link
                  to={user.isAdmin ? '/admin' : '/dashboard'}
                  className="text-white hover:text-[#0f9d58] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#0f9d58] transition-colors text-left"
                >
                  لاگ آؤٹ
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-[#0f9d58] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  لاگ ان
                </Link>
                <Link to="/signup" className="btn-primary text-center" onClick={() => setIsMobileMenuOpen(false)}>
                  سائن اپ
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const rotatingTexts = ['موٹر سائیکل', 'آئی فون', 'ایل ای ڈی ٹی وی', 'لیپ ٹاپ', 'واشنگ مشین', 'بڑے انعامات'];

  const allPrizes = [
    { icon: Smartphone, name: 'آئی فون' },
    { icon: Bike, name: 'موٹر سائیکل' },
    { icon: Tv, name: 'ایل ای ڈی ٹی وی' },
    { icon: Laptop, name: 'لیپ ٹاپ' },
    { icon: Wind, name: 'پنکھا' },
    { icon: WashingMachine, name: 'واشنگ مشین' },
  ];

  const [displayedPrizes, setDisplayedPrizes] = useState(allPrizes.slice(0, 4));

  useEffect(() => {
    setIsVisible(true);
    
    // Rotate headline text
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);

    // Rotate prize icons
    const prizeInterval = setInterval(() => {
      setDisplayedPrizes(() => {
        const shuffled = [...allPrizes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      });
    }, 4000);

    return () => {
      clearInterval(textInterval);
      clearInterval(prizeInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-green-black">
      <ParticleBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0b]/50 to-[#0b0b0b]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Main Headline */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-urdu">
            صرف <span className="text-[#0f9d58]">10 روپے</span> میں جیتو
            <br />
            <span className="inline-block min-w-[250px] bg-gradient-to-r from-[#0f9d58] to-[#14b86b] bg-clip-text text-transparent transition-opacity duration-500">
              {rotatingTexts[currentTextIndex]}!
            </span>
          </h1>
        </div>

        {/* Prize Icons */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 min-h-[120px]">
          {displayedPrizes.map((prize, index) => (
            <div
              key={prize.name + index}
              className={`flex flex-col items-center gap-2 animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-[#2a2a2a] hover:border-[#0f9d58] transition-all duration-300 hover:shadow-glow group">
                <prize.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#0f9d58] group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm sm:text-base text-gray-300 font-urdu">{prize.name}</span>
            </div>
          ))}
        </div>

        {/* Subheadline */}
        <p
          className={`text-lg sm:text-xl text-gray-300 mb-10 font-urdu transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          آج ہی حصہ لو اور اپنی قسمت آزماؤ!
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '1200ms' }}
        >
          <Link to="/signup" className="btn-primary text-lg flex items-center justify-center gap-2 animate-pulse-glow">
            <Sparkles className="w-5 h-5" />
            ابھی جوائن کریں
          </Link>
          <a href="https://expo.dev/accounts/winstrike.info/projects/moripgc/builds/731eb338-44ae-4319-942e-495662b80019" download className="btn-secondary text-lg flex items-center justify-center gap-2 bg-[#0a7a44] border-transparent text-white hover:bg-[#0f9d58]">
            <Smartphone className="w-5 h-5" />
            ایپ ڈاؤنلوڈ کریں
          </a>
          <Link to="/login" className="btn-secondary text-lg flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            لاگ ان کریں
          </Link>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '1400ms' }}
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#0f9d58]">10K+</div>
            <div className="text-sm text-gray-400 font-urdu">صارفین</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#0f9d58]">500+</div>
            <div className="text-sm text-gray-400 font-urdu">فاتحین</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#0f9d58]">100%</div>
            <div className="text-sm text-gray-400 font-urdu">شفاف</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Prizes Section
const PrizesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const allPrizes = [
    {
      name: 'آئی فون',
      subtitle: 'تازہ ترین ماڈل',
      image: '/prize-iphone.png',
      icon: Smartphone
    },
    {
      name: 'ایل ای ڈی ٹی وی',
      subtitle: '32 انچ اسمارٹ ٹی وی',
      image: '/prize-tv.png',
      icon: Tv
    },
    {
      name: 'پنکھا',
      subtitle: 'چھت کا پنکھا',
      image: '/prize-fan.png',
      icon: Wind
    },
    {
      name: 'واشنگ مشین',
      subtitle: 'خودکار واشنگ مشین',
      image: '/prize-washingmachine.png',
      icon: WashingMachine
    },
    {
      name: 'موٹر سائیکل',
      subtitle: 'Honda CD 70',
      image: '/prize-bike.png',
      icon: Bike
    },
    {
      name: 'لیپ ٹاپ',
      subtitle: 'Core i5 10th Gen',
      icon: Laptop
    },
    {
      name: 'کیش انعام',
      subtitle: '50,000 روپے',
      icon: Trophy
    },
    {
      name: 'اسمارٹ واچ',
      subtitle: 'فٹنس ٹریکر',
      image: '/prize-smartwatch.png',
      icon: CheckCircle
    }
  ];

  const [displayedPrizes, setDisplayedPrizes] = useState(allPrizes.slice(0, 4));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const interval = setInterval(() => {
      setDisplayedPrizes(() => {
        const shuffled = [...allPrizes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
      });
    }, 4000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#0b0b0b] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0f9d58]/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-urdu">
            انعامات جو آپ <span className="text-[#0f9d58]">جیت سکتے ہیں</span>
          </h2>

        </div>

        {/* Prize Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
          {displayedPrizes.map((prize, index) => (
            <div
              key={prize.name + index}
              className={`group animate-fade-in-up`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#2a2a2a] card-hover h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-b from-[#141414] to-[#1a1a1a] flex items-center justify-center p-6 flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-radial-green opacity-50" />
                  {prize.image ? (
                    <img
                      src={prize.image}
                      alt={prize.name}
                      className="relative z-10 max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <prize.icon className="relative z-10 w-24 h-24 text-[#0f9d58] group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 text-center flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 font-urdu">{prize.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 font-urdu">{prize.subtitle}</p>
                  </div>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 text-[#0f9d58] hover:text-[#14b86b] transition-colors font-semibold mx-auto"
                  >
                    جیتنے کا موقع!
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trust Section
const TrustSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const trustPoints = [
    {
      icon: Shield,
      title: '100% شفاف نظام',
      description: 'ہر entry ریکارڈ ہوتی ہے',
    },
    {
      icon: CheckCircle,
      title: 'ہر entry ریکارڈ ہوتی ہے',
      description: 'مکمل ٹریکنگ سسٹم',
    },
    {
      icon: Trophy,
      title: 'فاتحین کا اعلان',
      description: 'سب کو دیکھنے کی اجازت',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-[#0b0b0b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-urdu">
            کیوں ہم پر <span className="text-[#0f9d58]">اعتماد کریں؟</span>
          </h2>
        </div>

        {/* Trust Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustPoints.map((point, index) => (
            <div
              key={point.title}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: `${200 + index * 200}ms` }}
            >
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] text-center card-hover group">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#0f9d58]/20 to-[#0a7a44]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-shadow duration-300">
                  <point.icon className="w-10 h-10 text-[#0f9d58]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 font-urdu">{point.title}</h3>
                <p className="text-gray-400 font-urdu">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Recent Winners Section
const RecentWinnersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const winners = [
    { name: 'علی رضا', prize: 'موٹر سائیکل (Honda CD 70)', date: 'پچھلے مہینے', image: 'https://i.pravatar.cc/150?u=ali' },
    { name: 'عثمان خان', prize: 'آئی فون 15 پرو', date: '3 ہفتے پہلے', image: 'https://i.pravatar.cc/150?u=usman' },
    { name: 'زینب بی بی', prize: 'ایل ای ڈی ٹی وی 32"', date: 'پچھلے مہینے', image: 'https://i.pravatar.cc/150?u=zainab' },
    { name: 'محمد احمد', prize: 'لیپ ٹاپ (Core i5)', date: '2 مہینے پہلے', image: 'https://i.pravatar.cc/150?u=ahmad' },
    { name: 'بلال قریشی', prize: 'واشنگ مشین', date: '1 مہینہ پہلے', image: 'https://i.pravatar.cc/150?u=bilal' },
    { name: 'سعدیہ نور', prize: '50,000 روپے کیش', date: 'پچھلے ہفتے', image: 'https://i.pravatar.cc/150?u=sadia' },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-[#0b0b0b] relative border-t border-[#2a2a2a]">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f9d58]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-urdu">
            ہمارے پچھلے <span className="text-[#0f9d58]">خوش نصیب فاتحین</span>
          </h2>
          <p className="text-gray-400 text-lg font-urdu">ان لوگوں نے صرف 10 روپے میں بڑے انعامات جیتے!</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner, index) => (
            <div
              key={index}
              className={`bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] flex items-center gap-5 card-hover transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0f9d58] to-[#14b86b] rounded-full opacity-50 blur-sm"></div>
                <img src={winner.image} alt={winner.name} className="relative w-16 h-16 rounded-full border-2 border-[#0f9d58] object-cover" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl font-urdu mb-1">{winner.name}</h3>
                <p className="text-[#0f9d58] text-sm font-urdu font-semibold bg-[#0f9d58]/10 px-2 py-0.5 rounded-full inline-block mb-1">{winner.prize}</p>
                <p className="text-gray-500 text-xs font-urdu">{winner.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#0b0b0b] border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">

            <span className="text-xl font-bold text-white font-poppins">
              Win <span className="text-[#0f9d58]">Strike</span>
            </span>
            </Link>
            <p className="text-gray-400 font-urdu leading-relaxed max-w-md">
              پاکستان کا سب سے بڑا آن لائن لکی ڈرا پلیٹ فارم۔ صرف 10 روپے میں بڑے انعامات جیتنے کا موقع。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-urdu">فوری لنکس</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#0f9d58] transition-colors font-urdu">
                  ہوم
                </Link>
              </li>

              <li>
                <Link to="/login" className="text-gray-400 hover:text-[#0f9d58] transition-colors font-urdu">
                  لاگ ان
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-[#0f9d58] transition-colors font-urdu">
                  سائن اپ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-urdu">رابطہ</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 font-urdu">ای میل: winstrike.info@gmail.com</li>
              <li className="text-gray-400 font-urdu">پتہ: لاہور، پاکستان</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#2a2a2a] mt-12 pt-8 text-center">
          <p className="text-gray-500 font-urdu">
            © 2024 ون اسٹرائیک۔ جملہ حقوق محفوظ ہیں۔
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage Component
const HomePage = ({ user, onLogout }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <Header user={user} onLogout={onLogout} />
      <main>
        <HeroSection />
        <RecentWinnersSection />
        <PrizesSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
