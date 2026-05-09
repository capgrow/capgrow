import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, List, Trophy, LogOut, 
  Upload, CheckCircle, Clock, Menu, Sparkles,
  ChevronRight, FileImage, CreditCard, Phone,
  Gift, Calendar, Copy
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface UserDashboardProps {
  user: { id?: string; name: string; email: string; isAdmin: boolean };
  onLogout: () => void;
}

// Sidebar Component
const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onLogout,
  isMobileOpen,
  setIsMobileOpen
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'ڈیش بورڈ', icon: LayoutDashboard },
    { id: 'deposit', label: 'ڈپازٹ', icon: Wallet },
    { id: 'entries', label: 'میری انٹریز', icon: List },
    { id: 'upcoming', label: 'آنے والے ڈرا', icon: Gift },
    { id: 'results', label: 'نتائج', icon: Trophy },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#141414] border-r border-[#2a2a2a] z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <Link to="/" className="flex items-center gap-2">

            <span className="text-xl font-bold text-white font-poppins">
              Win <span className="text-[#0f9d58]">Strike</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-[#0f9d58]/10 text-[#0f9d58] border-l-3 border-[#0f9d58]'
                  : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-urdu">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a2a2a]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-urdu">لاگ آؤٹ</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Dashboard Stats Component
const DashboardStats = ({ user }: { user: any }) => {
  const [stats, setStats] = useState<any[]>([
    { label: 'کل انٹریز', value: '...', icon: List, color: 'blue' },
    { label: 'ڈپازٹ کی حالت', value: '...', icon: CheckCircle, color: 'green' },
    { label: 'نتیجہ کی حالت', value: '...', icon: Clock, color: 'yellow' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      let userId = user?.id;
      if (!userId) {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id;
      }
      
      if (!userId) return;

      // 1. Total Entries (Tickets)
      const { count: entriesCount } = await supabase.from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // 2. Latest Deposit Status
      const { data: latestTrans } = await supabase.from('transactions')
        .select('status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      const depositStatus = latestTrans?.[0]?.status === 'COMPLETED' ? 'منظور شدہ' : 
                           latestTrans?.[0]?.status === 'FAILED' ? 'مسترد' : 
                           latestTrans?.[0]?.status === 'PENDING' ? 'زیر التوا' : '---';

      // 3. Winning Status
      const { data: winData } = await supabase.from('winners')
        .select('*')
        .eq('winner_name', user.name)
        .limit(1);

      const winStatus = winData && winData.length > 0 ? 'آپ جیت گئے!' : 'زیر انتظار';

      setStats([
        { label: 'کل انٹریز', value: (entriesCount || 0).toString(), icon: List, color: 'blue' },
        { label: 'ڈپازٹ کی حالت', value: depositStatus, icon: CheckCircle, color: 'green' },
        { label: 'نتیجہ کی حالت', value: winStatus, icon: Clock, color: 'yellow' },
      ]);
    };
    fetchStats();
  }, [user]);

  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] card-hover"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              stat.color === 'green' ? 'bg-green-500/10' :
              stat.color === 'blue' ? 'bg-blue-500/10' :
              'bg-yellow-500/10'
            }`}>
              <stat.icon className={`w-6 h-6 ${
                stat.color === 'green' ? 'text-green-500' :
                stat.color === 'blue' ? 'text-blue-500' :
                'text-yellow-500'
              }`} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-urdu mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-white font-urdu">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// Deposit Form Component
const DepositForm = ({ user, selectedDraw }: { user: any, selectedDraw?: any }) => {
  const [formData, setFormData] = useState({
    cnic: '',
    phone: '',
  });
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [cnicImage, setCnicImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const screenshotRef = useRef<HTMLInputElement>(null);
  const cnicRef = useRef<HTMLInputElement>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnicImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const supabase = createClient();
    let authUserId = user.id;

    if (!authUserId) {
      const { data } = await supabase.auth.getUser();
      authUserId = data.user?.id;
    }

    if (!authUserId) {
      setErrorMsg('براہ کرم دوبارہ لاگ ان کریں');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('transactions').insert({
      user_id: authUserId,
      amount: selectedDraw ? selectedDraw.entry_fee : 10,
      type: 'DEPOSIT',
      status: 'PENDING',
      screenshot: screenshot, // This stores the base64 string
      draw_name: selectedDraw ? selectedDraw.title : null
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setShowSuccess(true);
    setFormData({ cnic: '', phone: '' });
    setScreenshot(null);
    setCnicImage(null);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-2 font-urdu">ڈپازٹ کریں</h2>
      
      {/* Admin Payment Details */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#0f9d58] mb-6 relative">
        <h3 className="text-lg font-bold text-white mb-4 font-urdu">پیسے اس نمبر پر بھیجیں:</h3>
        
        <div className="bg-[#141414] p-4 rounded-lg mb-4 flex items-center justify-between border border-[#2a2a2a]">
          <div>
            <p className="text-gray-400 text-sm font-urdu mb-1">اکاؤنٹ ٹائٹل: <span className="text-white font-sans">Mustajab Ali Hazma</span></p>
            <p className="text-gray-400 text-sm font-urdu mb-1">بینک / طریقہ: <span className="text-white font-sans">Jazzcash</span></p>
            <p className="text-[#0f9d58] text-2xl font-bold tracking-wider font-sans">03296936949</p>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText('03296936949');
              const target = e.currentTarget;
              const originalHtml = target.innerHTML;
              target.innerHTML = '<span class="text-xs font-urdu text-green-400">کاپی ہو گیا!</span>';
              setTimeout(() => target.innerHTML = originalHtml, 2000);
            }}
            className="p-3 bg-[#0f9d58]/10 hover:bg-[#0f9d58]/20 rounded-lg text-[#0f9d58] transition-colors"
            title="نمبر کاپی کریں"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-400 text-sm mt-2 font-urdu">پیسے بھیجنے کے بعد اپنی معلومات یہاں درج کریں تاکہ آپ کا بیلنس اپڈیٹ ہو سکے، شکریہ!</p>
      </div>

      {/* Selected Draw Info */}
      {selectedDraw && (
        <div className="bg-[#0f9d58]/10 border border-[#0f9d58]/30 rounded-xl p-4 mb-6">
          <p className="text-[#0f9d58] font-urdu font-bold">آپ " {selectedDraw.title} " کے لیے انٹری جمع کروا رہے ہیں جس کی فیس {selectedDraw.entry_fee} روپے ہے۔</p>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <p className="text-green-400 font-urdu">آپ کی درخواست کامیابی سے جمع کر دی گئی ہے!</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 font-urdu">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Screenshot Upload */}
        <div>
          <label className="block text-sm text-gray-300 mb-2 font-urdu">
            ادائیگی کا اسکرین شاٹ اپ لوڈ کریں
          </label>
          <div
            onClick={() => screenshotRef.current?.click()}
            className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-8 text-center cursor-pointer hover:border-[#0f9d58] transition-colors"
          >
            {screenshot ? (
              <div className="flex items-center justify-center gap-3">
                <FileImage className="w-8 h-8 text-[#0f9d58]" />
                <span className="text-white">اسکرین شاٹ منسلک کر دیا گیا ہے</span>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 font-urdu">اسکرین شاٹ یہاں ڈراپ کریں یا کلک کریں</p>
              </>
            )}
            <input
              ref={screenshotRef}
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
              className="hidden"
            />
          </div>
        </div>

        {/* CNIC Number */}
        <div>
          <label className="block text-sm text-gray-300 mb-2 font-urdu">
            سی این آئی سی نمبر درج کریں
          </label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.cnic}
              onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
              placeholder="XXXXX-XXXXXXX-X"
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* CNIC Image Upload */}
        <div>
          <label className="block text-sm text-gray-300 mb-2 font-urdu">
            سی این آئی سی تصویر اپ لوڈ کریں
          </label>
          <div
            onClick={() => cnicRef.current?.click()}
            className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-6 text-center cursor-pointer hover:border-[#0f9d58] transition-colors"
          >
            {cnicImage ? (
              <div className="flex items-center justify-center gap-3">
                <FileImage className="w-6 h-6 text-[#0f9d58]" />
                <span className="text-white text-sm">تصویر منسلک کر دی گئی ہے</span>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm font-urdu">سی این آئی سی تصویر اپ لوڈ کریں</p>
              </>
            )}
            <input
              ref={cnicRef}
              type="file"
              accept="image/*"
              onChange={handleCnicChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm text-gray-300 mb-2 font-urdu">
            فون نمبر
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="03XX-XXXXXXX"
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>جمع کروائیں</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// My Entries Component
const MyEntries = ({ user }: { user: any }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const supabase = createClient();
      let authUserId = user?.id;
      if (!authUserId) {
         const { data } = await supabase.auth.getUser();
         authUserId = data.user?.id;
      }
      if (authUserId) {
        const { data } = await supabase.from('tickets')
          .select('*, lucky_draws(title)')
          .eq('user_id', authUserId)
          .order('created_at', { ascending: false });
        if (data) setEntries(data);
      }
      setLoading(false);
    };
    fetchEntries();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 font-urdu">میری انٹریز</h2>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#141414]">
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">ڈرا / انعام</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">ٹکٹ نمبر</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-400">Loading...</td></tr>
              ) : entries.length === 0 ? (
                 <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-400">کوئی ریکارڈ نہیں ملا</td></tr>
              ) : entries.map((entry, index) => (
                <tr key={index} className="border-t border-[#2a2a2a] hover:bg-[#141414] transition-colors">
                  <td className="px-6 py-4 text-white font-urdu">{entry.lucky_draws?.title || '---'}</td>
                  <td className="px-6 py-4 text-[#0f9d58] font-bold">{entry.ticket_number}</td>
                  <td className="px-6 py-4 text-gray-400 font-urdu">{new Date(entry.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Upcoming Draws Component - NEW!
const UpcomingDraws = ({ setActiveTab, onSelectDraw }: { user?: any, setActiveTab?: (tab: string) => void, onSelectDraw?: (draw: any) => void }) => {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDraws = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('lucky_draws')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });
    if (data) setDraws(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-urdu">آنے والے ڈرا</h2>
        <button 
          onClick={() => { setLoading(true); fetchDraws(); }}
          className="text-[#0f9d58] hover:text-white transition-colors text-sm font-urdu flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" />
          تازہ کریں (Refresh)
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
           <p className="text-gray-400 text-center py-8">لوڈ ہو رہا ہے...</p>
        ) : draws.length === 0 ? (
           <p className="text-gray-400 text-center py-8">فی الحال کوئی لکی ڈرا دستیاب نہیں ہے۔</p>
        ) : draws.map((draw) => (
          <div key={draw.id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
            {/* Draw Header */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Prize Image */}
              <div className="w-full md:w-48 h-48 bg-gradient-to-b from-[#141414] to-[#1a1a1a] rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial-green opacity-30" />
                <img 
                  src={draw.image || '/prize-iphone.png'} 
                  alt={draw.title}
                  className="relative z-10 max-h-full max-w-full object-contain"
                />
              </div>

              {/* Draw Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 font-urdu">{draw.title}</h3>
                <p className="text-gray-400 mb-4 text-sm">{draw.description}</p>
                <div className="flex items-center gap-4 mb-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0f9d58]" />
                    <span className="font-urdu">{new Date(draw.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0f9d58]" />
                    <span>{new Date(draw.end_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#141414] rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm font-urdu">انٹری فیس</p>
                    <p className="text-xl font-bold text-gray-300">Rs {draw.entry_fee}</p>
                  </div>
                  <div className="bg-[#141414] rounded-lg p-4 text-center">
                    <button 
                      onClick={() => {
                        if (onSelectDraw) onSelectDraw(draw);
                        if (setActiveTab) setActiveTab('deposit');
                      }}
                      className="bg-[#0f9d58] hover:bg-[#0a7a44] text-white w-full h-full rounded-md font-bold transition-colors"
                    >
                      حصہ لیں
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Results Component
const Results = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('winners')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setWinners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white mb-6 font-urdu">نتائج (حالیہ فاتحین)</h2>
        <button 
          onClick={() => { setLoading(true); fetchWinners(); }}
          className="text-[#0f9d58] hover:text-white transition-colors text-sm font-urdu flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4" />
          تازہ کریں (Refresh)
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">لوڈ ہو رہا ہے...</p>
      ) : winners.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2a2a] text-center">
          <div className="w-24 h-24 bg-[#141414] rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-urdu">
            ابھی تک کوئی انعام نہیں
          </h3>
          <p className="text-gray-400 mb-6 font-urdu">
            ابھی تک کسی نے انعام نہیں جیتا۔ اگلے لکی ڈرا کا انتظار کریں!
          </p>
          <Link to="/#deposit" className="btn-primary inline-flex items-center gap-2">
            انٹری خریدیں
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner, index) => (
            <div key={winner.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] rounded-xl p-6 border border-[#2a2a2a] relative overflow-hidden card-hover" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/5 rounded-bl-full" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ffd700] to-[#ffaa00] rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-urdu">
                  مبارک ہو! 🎉
                </h3>
                <p className="text-xl font-bold text-[#0f9d58] mb-1 font-urdu">{winner.winner_name}</p>
                <p className="text-sm text-gray-400 mb-1 font-sans">{winner.winner_cnic}</p>
                <p className="text-gray-400 font-urdu">انعام: {winner.prize_name}</p>
                <p className="text-xs text-gray-500 mt-4">{new Date(winner.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



// Main Dashboard Component
const UserDashboard = ({ user, onLogout }: UserDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDraw, setSelectedDraw] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white font-urdu">
                خوش آمدید، {user.name}!
              </h2>
            </div>
            <DashboardStats user={user} />
            
            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => { setSelectedDraw(null); setActiveTab('deposit'); }}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] card-hover cursor-pointer"
              >
                <Wallet className="w-10 h-10 text-[#0f9d58] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 font-urdu">نیا ڈپازٹ</h3>
                <p className="text-gray-400 text-sm font-urdu">10 روپے جمع کریں اور انٹری حاصل کریں</p>
              </div>
              <div 
                onClick={() => setActiveTab('upcoming')}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] card-hover cursor-pointer"
              >
                <Gift className="w-10 h-10 text-[#0f9d58] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 font-urdu">آنے والے ڈرا</h3>
                <p className="text-gray-400 text-sm font-urdu">انعامات اور تاریخیں دیکھیں</p>
              </div>
              <div 
                onClick={() => setActiveTab('entries')}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] card-hover cursor-pointer"
              >
                <List className="w-10 h-10 text-[#0f9d58] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 font-urdu">میری انٹریز</h3>
                <p className="text-gray-400 text-sm font-urdu">اپنی شرکت دیکھیں</p>
              </div>
              <div 
                onClick={() => setActiveTab('results')}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] card-hover cursor-pointer"
              >
                <Trophy className="w-10 h-10 text-[#0f9d58] mb-4" />
                <h3 className="text-lg font-bold text-white mb-2 font-urdu">نتائج دیکھیں</h3>
                <p className="text-gray-400 text-sm font-urdu">اپنے نتائج چیک کریں</p>
              </div>
            </div>

            {/* Live Draws Section - Added for direct visibility */}
            <div className="pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-[#0f9d58] rounded-full"></div>
                <h2 className="text-2xl font-bold text-white font-urdu">لائیو ڈرا (Live Draws)</h2>
              </div>
              <UpcomingDraws user={user} setActiveTab={setActiveTab} onSelectDraw={setSelectedDraw} />
            </div>
          </div>
        );
      case 'deposit':
        return <DepositForm user={user} selectedDraw={selectedDraw} />;
      case 'entries':
        return <MyEntries user={user} />;
      case 'upcoming':
        return <UpcomingDraws user={user} setActiveTab={setActiveTab} onSelectDraw={setSelectedDraw} />;
      case 'results':
        return <Results />;

      default:
        return <DashboardStats user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-[#141414] border-b border-[#2a2a2a] p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold text-white font-poppins">
            Win <span className="text-[#0f9d58]">Strike</span>
          </span>
          <div className="w-6" />
        </header>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
