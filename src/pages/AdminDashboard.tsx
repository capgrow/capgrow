import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wallet, Trophy, LogOut, 
  Menu, CheckCircle, X, ChevronRight,
  User, CreditCard, Crown,
  Calendar, Clock, Upload, Gift, Eye, AlertTriangle
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface AdminDashboardProps {
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
    { id: 'users', label: 'صارفین', icon: Users },
    { id: 'deposits', label: 'ڈپازٹس', icon: Wallet },
    { id: 'upcoming', label: 'آنے والے ڈرا', icon: Gift },
    { id: 'winners', label: 'فاتحین', icon: Trophy },
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
          <div className="mt-2 flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#ffd700]" />
            <span className="text-sm text-[#ffd700] font-urdu">ایڈمن پینل</span>
          </div>
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
const DashboardStats = () => {
  const [stats, setStats] = useState([
    { label: 'کل صارفین', value: '...', icon: Users, color: 'blue' },
    { label: 'کل بیلنس (Rs)', value: '...', icon: Wallet, color: 'green' },
    { label: 'زیر التوا ڈپازٹس', value: '...', icon: ChevronRight, color: 'yellow' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      
      // 1. Get total users count
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      
      // 2. Get sum of user balances
      const { data: usersData } = await supabase.from('users').select('balance');
      const totalBalance = usersData?.reduce((sum, u) => sum + (u.balance || 0), 0) || 0;
      
      // 3. Get pending deposits count
      const { count: pendingCount } = await supabase.from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      setStats([
        { label: 'کل صارفین', value: (usersCount || 0).toLocaleString(), icon: Users, color: 'blue' },
        { label: 'کل بیلنس (Rs)', value: totalBalance.toLocaleString(), icon: Wallet, color: 'green' },
        { label: 'زیر التوا ڈپازٹس', value: (pendingCount || 0).toLocaleString(), icon: ChevronRight, color: 'yellow' },
      ]);
    };
    fetchStats();
  }, []);

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
          <p className="text-2xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// Users Component
const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) console.error("Error fetching users:", error);
      if (data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-urdu">صارفین</h2>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-center py-8">لوڈ ہو رہا ہے...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#141414]">
                  <th className="px-6 py-4 text-right text-gray-400 font-urdu">نام</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-urdu">فون / ای میل</th>
                  <th className="px-6 py-4 text-right text-gray-400 font-urdu">بیلنس</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-t border-[#2a2a2a] hover:bg-[#141414] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0f9d58]/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-[#0f9d58]" />
                        </div>
                        <span className="text-white font-urdu">{user.name || 'نامعلوم'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="text-sm">{user.phone}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#0f9d58]/20 text-[#0f9d58] rounded-full text-sm font-semibold">
                        Rs {user.balance || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Deposits Component
const DepositsList = () => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    const supabase = createClient();
    // Fetch pending transactions with user details
    const { data, error } = await supabase.from('transactions')
      .select('*, users(name, phone)') 
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching deposits:", error);
    if (data) setDeposits(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleApprove = async (deposit: any) => {
    const supabase = createClient();
    
    try {
      // 1. If it's a draw entry, create a ticket
      if (deposit.draw_name) {
        const { data: draw } = await supabase.from('lucky_draws')
          .select('id')
          .eq('title', deposit.draw_name)
          .eq('status', 'ACTIVE')
          .single();
        
        if (draw) {
          await supabase.from('tickets').insert({
            user_id: deposit.user_id,
            draw_id: draw.id,
            ticket_number: `TKT-${Math.floor(100000 + Math.random() * 900000)}`
          });
        }
      } else {
        // 2. If it's a general deposit, update user balance
        const { data: userData } = await supabase.from('users').select('balance').eq('id', deposit.user_id).single();
        const currentBalance = userData?.balance || 0;
        await supabase.from('users').update({ 
          balance: currentBalance + deposit.amount 
        }).eq('id', deposit.user_id);
      }

      // 3. Update transaction status
      await supabase.from('transactions').update({ status: 'COMPLETED' }).eq('id', deposit.id);
      alert("✅ ڈپازٹ منظور کر لیا گیا ہے!");
    } catch (err) {
      console.error("Approval error:", err);
      alert("❌ منظور کرتے وقت مسئلہ آیا");
    }
    
    fetchDeposits();
  };

  const handleReject = async (id: string) => {
    const supabase = createClient();
    await supabase.from('transactions').update({ status: 'FAILED' }).eq('id', id);
    alert("❌ ڈپازٹ مسترد کر دیا گیا ہے");
    fetchDeposits();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 font-urdu">ڈپازٹس</h2>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#141414]">
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">صارف</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">ڈرا / پروڈکٹ</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">رقم</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">اسکرین شاٹ</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">حالت</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">عمل</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4 text-gray-400">Loading...</td></tr>
              ) : deposits.map((deposit) => (
                <tr key={deposit.id} className="border-t border-[#2a2a2a] hover:bg-[#141414] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0f9d58]/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#0f9d58]" />
                      </div>
                      <span className="text-white font-urdu text-sm">
                        {deposit.users?.name || deposit.user_id?.slice(0, 8) + '...'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-urdu">
                    {deposit.draw_name ? (
                      <span className="bg-[#0f9d58]/20 text-[#0f9d58] px-3 py-1 rounded-full text-xs font-semibold">
                        {deposit.draw_name}
                      </span>
                    ) : (
                      <span className="text-gray-500">جنرل ڈپازٹ</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#0f9d58] font-urdu">{deposit.amount} روپے</td>
                  <td className="px-6 py-4">
                    {deposit.screenshot ? (
                      <img 
                        src={deposit.screenshot} 
                        alt="Screenshot" 
                        className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:scale-[4] hover:z-50 transition-transform origin-center relative" 
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#141414] rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-urdu ${
                      deposit.status === 'COMPLETED' 
                        ? 'bg-green-500/20 text-green-400' 
                        : deposit.status === 'FAILED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {deposit.status === 'COMPLETED' ? 'منظور شدہ' : 
                       deposit.status === 'FAILED' ? 'مسترد' : 'زیر التوا'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {deposit.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(deposit)}
                          className="p-2 bg-green-500/10 rounded-lg text-green-500 hover:bg-green-500/20 transition-colors"
                          title="منظور کریں"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(deposit.id)}
                          className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
                          title="مسترد کریں"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
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
const UpcomingDraws = () => {
  const [draws, setDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDraws = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // Fetch draws first
    const { data: drawsList } = await supabase.from('lucky_draws')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (drawsList) {
      const drawsWithCounts = await Promise.all(drawsList.map(async (draw) => {
        // Fetch real ticket count
        const { count } = await supabase.from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('draw_id', draw.id);
        
        // Fetch actual users/tickets for this draw
        const { data: ticketUsers } = await supabase.from('tickets')
          .select('*, users(name, phone)')
          .eq('draw_id', draw.id);

        return { ...draw, entries: count || 0, investedUsers: ticketUsers || [] };
      }));
      setDraws(drawsWithCounts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDraw, setNewDraw] = useState({
    prizeName: '',
    description: '',
    drawDate: '',
    drawTime: '',
    image: null as string | null
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDraw({ ...newDraw, image: reader.result as string });
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDraw = async () => {
    if (newDraw.prizeName && newDraw.drawDate && newDraw.drawTime) {
      setIsSubmitting(true);
      const supabase = createClient();
      
      const { error } = await supabase.from('lucky_draws').insert({
        title: newDraw.prizeName,
        description: newDraw.description || 'نیا ڈرا',
        entry_fee: 10,
        start_date: new Date().toISOString(),
        end_date: new Date(`${newDraw.drawDate}T${newDraw.drawTime}`).toISOString(),
        status: 'ACTIVE',
        image: newDraw.image
      });

      setIsSubmitting(false);

      if (!error) {
        setNewDraw({ prizeName: '', description: '', drawDate: '', drawTime: '', image: null });
        setPreviewImage(null);
        setShowAddForm(false);
        fetchDraws();
      } else {
        alert(error.message);
      }
    }
  };

  const handleDeleteDraw = async (id: string) => {
    const supabase = createClient();
    await supabase.from('lucky_draws').update({ status: 'CANCELLED' }).eq('id', id);
    fetchDraws();
  };

  // Sample invested users for each draw

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-urdu">آنے والے ڈرا</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Gift className="w-5 h-5" />
          نیا ڈرا شامل کریں
        </button>
      </div>

      {/* Add New Draw Form */}
      {showAddForm && (
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] mb-8 animate-fade-in-up">
          <h3 className="text-lg font-bold text-white mb-4 font-urdu">نیا ڈرا شامل کریں</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Prize Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-urdu">انعام کا نام</label>
              <input
                type="text"
                value={newDraw.prizeName}
                onChange={(e) => setNewDraw({ ...newDraw, prizeName: e.target.value })}
                placeholder="مثلاً: آئی فون 15 Pro Max"
                className="input-field"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-300 mb-2 font-urdu">تفصیل (Description)</label>
              <textarea
                value={newDraw.description}
                onChange={(e) => setNewDraw({ ...newDraw, description: e.target.value })}
                placeholder="ڈرا کے بارے میں مزید معلومات لکھیں..."
                className="input-field min-h-[80px]"
              />
            </div>

            {/* Draw Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-urdu">ڈرا کی تاریخ</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  value={newDraw.drawDate}
                  onChange={(e) => setNewDraw({ ...newDraw, drawDate: e.target.value })}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Draw Time */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-urdu">ڈرا کا وقت</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="time"
                  value={newDraw.drawTime}
                  onChange={(e) => setNewDraw({ ...newDraw, drawTime: e.target.value })}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Prize Image */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-urdu">انعام کی تصویر</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2a2a2a] rounded-xl p-4 text-center cursor-pointer hover:border-[#0f9d58] transition-colors"
              >
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-20 mx-auto object-contain" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-400 text-sm font-urdu">تصویر اپ لوڈ کریں</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddDraw}
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? <span>جاری ہے...</span> : <span>ڈرا شامل کریں</span>}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary flex-1"
            >
              منسوخ کریں
            </button>
          </div>
        </div>
      )}

      {/* Draws List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-400 text-center py-8">لوڈ ہو رہا ہے...</p>
        ) : draws.map((draw) => (
          <div key={draw.id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
            {/* Draw Header */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Prize Image */}
              <div className="w-full md:w-48 h-48 bg-[#141414] rounded-xl flex items-center justify-center p-4">
                <img 
                  src={draw.image || '/prize-iphone.png'} 
                  alt={draw.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Draw Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white font-urdu">{draw.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-urdu">{new Date(draw.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(draw.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDraw(draw.id)}
                    className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#141414] rounded-lg p-4">
                    <p className="text-gray-400 text-sm font-urdu">کل انٹریز</p>
                    <p className="text-2xl font-bold text-[#0f9d58]">{draw.entries}</p>
                  </div>
                  <div className="bg-[#141414] rounded-lg p-4">
                    <p className="text-gray-400 text-sm font-urdu">کل رقم</p>
                    <p className="text-2xl font-bold text-[#0f9d58]">Rs {draw.entries * 10}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invested Users Section */}
            <div className="border-t border-[#2a2a2a]">
              <div className="p-4 bg-[#141414]">
                <h4 className="text-lg font-semibold text-white mb-4 font-urdu flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#0f9d58]" />
                  انvested صارفین
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="px-4 py-2 text-gray-400 text-sm font-urdu">نام</th>
                        <th className="px-4 py-2 text-gray-400 text-sm font-urdu">سی این آئی سی</th>
                        <th className="px-4 py-2 text-gray-400 text-sm font-urdu">تاریخ</th>
                        <th className="px-4 py-2 text-gray-400 text-sm font-urdu">رقم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {draw.investedUsers?.map((ticket: any, idx: number) => (
                        <tr key={idx} className="border-t border-[#2a2a2a]/50">
                          <td className="px-4 py-3 text-white font-urdu">{ticket.users?.name || 'نامعلوم'}</td>
                          <td className="px-4 py-3 text-gray-400">{ticket.users?.phone || '---'}</td>
                          <td className="px-4 py-3 text-gray-400">{new Date(ticket.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-[#0f9d58] font-urdu">Rs 10</td>
                        </tr>
                      ))}
                      {(!draw.investedUsers || draw.investedUsers.length === 0) && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-urdu">ابھی تک کوئی انٹری نہیں ہے۔</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Winners Component
const WinnersPanel = () => {
  const [winnerName, setWinnerName] = useState('');
  const [winnerCnic, setWinnerCnic] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [winners, setWinners] = useState<any[]>([]);
  const [activeDraws, setActiveDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWinners = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('winners')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setWinners(data);
    
    // Also fetch active draws for the dropdown
    const { data: drawsData } = await supabase.from('lucky_draws')
      .select('*')
      .eq('status', 'ACTIVE');
    if (drawsData) setActiveDraws(drawsData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchWinners();
  }, []);

  const handleAnnounce = async () => {
    if (winnerName && prizeName && winnerCnic) {
      const supabase = createClient();
      
      // 1. Insert Winner
      await supabase.from('winners').insert({
        winner_name: winnerName,
        prize_name: prizeName,
        winner_cnic: winnerCnic
      });

      // 2. Delete all deposits (transactions) for this specific drawn product
      await supabase.from('transactions').delete().eq('draw_name', prizeName);

      // 3. Mark the draw as COMPLETED so it gets removed from Active lists
      await supabase.from('lucky_draws').update({ status: 'COMPLETED' }).eq('title', prizeName);

      setShowConfetti(true);
      setWinnerName('');
      setPrizeName('');
      setWinnerCnic('');
      fetchWinners();
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleDeleteWinner = async (id: string) => {
    const supabase = createClient();
    await supabase.from('winners').delete().eq('id', id);
    fetchWinners();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 font-urdu">فاتحین کا اعلان</h2>

      {/* Winner Selection Form */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] mb-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Winner Name Input */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-urdu">
              فاتح کا نام درج کریں
            </label>
            <input
              type="text"
              value={winnerName}
              onChange={(e) => setWinnerName(e.target.value)}
              placeholder="مثال: علی احمد"
              className="input-field"
            />
          </div>

          {/* Winner CNIC Input */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-urdu">
              فاتح کا CNIC درج کریں
            </label>
            <input
              type="text"
              value={winnerCnic}
              onChange={(e) => setWinnerCnic(e.target.value)}
              placeholder="مثال: 34101-1234567-1"
              className="input-field"
            />
          </div>

          {/* Prize Name Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-urdu">
              انعام کا نام منتخب کریں
            </label>
            <select
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              className="input-field"
            >
              <option value="">انعام منتخب کریں...</option>
              {activeDraws.map((draw) => (
                <option key={draw.id} value={draw.title}>{draw.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Announce Button */}
        <button
          onClick={handleAnnounce}
          disabled={!winnerName || !prizeName || !winnerCnic}
          className="w-full mt-6 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trophy className="w-5 h-5" />
          فاتح کا اعلان کریں
        </button>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#0f9d58', '#ffd700', '#ff6b6b', '#4ecdc4'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Recent Winners */}
      <h3 className="text-xl font-bold text-white mb-4 font-urdu">حالیہ فاتحین</h3>
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#141414]">
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">فاتح</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">انعام</th>
                <th className="px-6 py-4 text-right text-gray-400 font-urdu">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">لوڈ ہو رہا ہے...</td>
                </tr>
              ) : winners.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">کوئی ریکارڈ نہیں ملا</td>
                </tr>
              ) : winners.map((winner) => (
                <tr key={winner.id} className="border-t border-[#2a2a2a]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#ffd700]/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-[#ffd700]" />
                      </div>
                      <span className="text-white font-urdu">{winner.winner_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#0f9d58] font-urdu">{winner.prize_name}</td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>{new Date(winner.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleDeleteWinner(winner.id)}
                        className="p-1.5 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
                        title="حذف کریں"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// Main Admin Dashboard Component

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResetData = async () => {
    const confirmDelete = window.confirm("⚠️ انتباہ: کیا آپ واقعی سارا ڈیٹا ڈیلیٹ کر کے ایپ کو زیرو سے شروع کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا!");
    if (!confirmDelete) return;

    try {
      const supabase = createClient();
      
      // Delete in order to avoid foreign key constraints
      
      // 0. Reset all user balances to 0
      const { error: balanceError } = await supabase.from('users').update({ balance: 0 }).neq('id', '00000000-0000-0000-0000-000000000000');

      // 1. Delete tickets first
      const { error: ticketsError } = await supabase.from('tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // 2. Delete transactions
      const { error: transError } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // 3. Delete winners
      const { error: winnersError } = await supabase.from('winners').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // 4. Delete lucky draws
      const { error: drawsError } = await supabase.from('lucky_draws').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (ticketsError || transError || winnersError || drawsError || balanceError) {
        const errorMsg = [ticketsError, transError, winnersError, drawsError, balanceError]
          .filter(e => e)
          .map(e => e?.message)
          .join(", ");
        alert("❌ ڈیٹا ڈیلیٹ کرتے وقت مسئلہ آیا: " + errorMsg);
      } else {
        alert("✅ سارا ڈیٹا کامیابی سے ڈیلیٹ ہو گیا ہے اور صارفین کا بیلنس بھی زیرو کر دیا گیا ہے!");
        window.location.reload();
      }
    } catch (e: any) {
      alert("❌ غیر متوقع مسئلہ آیا: " + e.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white font-urdu">
                  ایڈمن ڈیش بورڈ
                </h2>
                <p className="text-gray-400 font-urdu mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  آن لائن - خوش آمدید، {user.name}
                </p>
              </div>
            </div>
            
            <DashboardStats />

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'صارفین دیکھیں', tab: 'users', icon: Users, color: 'text-blue-500' },
                { label: 'ڈپازٹس چیک کریں', tab: 'deposits', icon: Wallet, color: 'text-green-500' },
                { label: 'آنے والے ڈرا', tab: 'upcoming', icon: Gift, color: 'text-purple-500' },
                { label: 'فاتحین کا اعلان', tab: 'winners', icon: Trophy, color: 'text-yellow-500' },
              ].map((action, i) => (
                <div
                  key={action.tab}
                  onClick={() => setActiveTab(action.tab)}
                  className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] hover:border-[#0f9d58]/50 card-hover cursor-pointer group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <action.icon className={`w-10 h-10 ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-lg font-bold text-white font-urdu">{action.label}</h3>
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div className="mt-12 bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
              <div className="flex items-start sm:items-center gap-4 mb-6 flex-col sm:flex-row">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-500 font-urdu mb-1">خطرناک زون (Danger Zone)</h3>
                  <p className="text-red-400/80 text-sm font-urdu leading-relaxed max-w-2xl">
                    یہاں سے ایپ کا ڈیٹا ری سیٹ کرنے پر تمام ڈراز، فاتحین کی تفصیلات، اور یوزرز کے ڈپازٹس کا سارا ریکارڈ ہمیشہ کے لیے ختم ہو جائے گا اور ایپ بالکل نئے سرے (Zero) سے شروع ہو جائے گی۔ (صارفین کے اکاؤنٹس محفوظ رہیں گے تاکہ انہیں دوبارہ رجسٹر نہ کرنا پڑے)
                  </p>
                </div>
              </div>
              <button 
                onClick={handleResetData}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl font-urdu transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
              >
                سارا ڈیٹا ڈیلیٹ کریں (زیرو سے شروع کریں)
              </button>
            </div>
          </div>
        );
      case 'users':
        return <UsersList />;
      case 'deposits':
        return <DepositsList />;
      case 'upcoming':
        return <UpcomingDraws />;
      case 'winners':
        return <WinnersPanel />;
      default:
        return <DashboardStats />;
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
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white font-poppins">
              Win <span className="text-[#0f9d58]">Strike</span>
            </span>
            <Crown className="w-4 h-4 text-[#ffd700]" />
          </div>
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

export default AdminDashboard;
