import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight,
  Smartphone, Tv, Wind, WashingMachine
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; isAdmin: boolean }) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('براہ کرم درست ای میل اور پاس ورڈ درج کریں');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    
    // Login with Supabase
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    const isAdmin = formData.email.toLowerCase().trim() === 'miansabmi7@gmail.com';
    const userName = authData.user?.user_metadata?.name || (isAdmin ? 'ایڈمن' : 'صارف');

    const userData = { 
      name: userName, 
      email: formData.email, 
      isAdmin: isAdmin 
    };

    onLogin(userData);

    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  // Floating prizes for visual effect
  const floatingPrizes = [
    { Icon: Smartphone, delay: '0s', position: 'top-20 left-10' },
    { Icon: Tv, delay: '2s', position: 'top-40 right-20' },
    { Icon: Wind, delay: '4s', position: 'bottom-32 left-20' },
    { Icon: WashingMachine, delay: '1s', position: 'bottom-20 right-10' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-green-black">
        {/* Floating Prizes */}
        {floatingPrizes.map((prize, index) => (
          <div
            key={index}
            className={`absolute ${prize.position} animate-float`}
            style={{ animationDelay: prize.delay }}
          >
            <div className="w-16 h-16 bg-[#1a1a1a]/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#2a2a2a]/50">
              <prize.Icon className="w-8 h-8 text-[#0f9d58]/50" />
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">

          <h2 className="text-4xl font-bold text-white mb-4 font-poppins text-center">
            Win <span className="text-[#0f9d58]">Strike</span>
          </h2>
          <p className="text-gray-400 text-center max-w-md font-urdu text-lg">
            پاکستان کا سب سے بڑا آن لائن لکی ڈرا پلیٹ فارم
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0f9d58]">10K+</div>
              <div className="text-sm text-gray-400 font-urdu">صارفین</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0f9d58]">500+</div>
              <div className="text-sm text-gray-400 font-urdu">فاتحین</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#0f9d58]">100%</div>
              <div className="text-sm text-gray-400 font-urdu">شفاف</div>
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0b0b0b]/50" />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Back Button (Mobile) */}
          <Link 
            to="/" 
            className="lg:hidden inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            واپس
          </Link>

          {/* Form Card */}
          <div className="glass rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 font-urdu">
                لاگ ان کریں
              </h1>
              <p className="text-gray-400 font-urdu">
                اپنے اکاؤنٹ میں لاگ ان کریں
              </p>
            </div>

            {/* Error Message */}
            <div className={`bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 transition-opacity ${error ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <p className="text-red-400 text-sm text-center font-urdu notranslate">{error}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-urdu">
                  ای میل
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-urdu">
                  پاس ورڈ
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>لاگ ان کریں</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-gray-500 text-sm font-urdu">یا</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            {/* Signup Link */}
            <p className="text-center text-gray-400 font-urdu">
              اکاؤنٹ نہیں ہے؟{' '}
              <Link to="/signup" className="text-[#0f9d58] hover:text-[#14b86b] transition-colors font-semibold">
                سائن اپ کریں
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
