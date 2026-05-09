import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles,
  Smartphone, Tv, Wind, WashingMachine
} from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface SignupPageProps {
  onLogin: (user: { name: string; email: string; isAdmin: boolean }) => void;
}

const SignupPage = ({ onLogin }: SignupPageProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
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

    // Validate
    if (!formData.name || !formData.email || !formData.password) {
      setError('براہ کرم تمام فیلڈز پر کریں');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    
    // Register user with Supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    const isAdmin = formData.email.toLowerCase().trim() === 'miansabmi7@gmail.com';
    // Success response
    const userData = { 
      name: formData.name, 
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
            آج ہی اکاؤنٹ بنائیں اور انعام جیتنا شروع کریں
          </p>
          
          {/* Benefits */}
          <div className="space-y-4 mt-12">
            {[
              'صرف 10 روپے میں شرکت',

              '100% شفاف نظام',
              'فوری انعام وصولی',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#0f9d58]/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-[#0f9d58]" />
                </div>
                <span className="text-gray-300 font-urdu">{benefit}</span>
              </div>
            ))}
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
                اکاؤنٹ بنائیں
              </h1>
              <p className="text-gray-400 font-urdu">
                نیا اکاؤنٹ بنانے کے لیے فارم پر کریں
              </p>
            </div>

            {/* Error Message */}
            <div className={`bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 transition-opacity ${error ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <p className="text-red-400 text-sm text-center font-urdu notranslate">{error}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-urdu">
                  نام
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="اپنا نام درج کریں"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>

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
                    placeholder="کم از کم 6 حروف"
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
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>اکاؤنٹ بنائیں</span>
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

            {/* Login Link */}
            <p className="text-center text-gray-400 font-urdu">
              پہلے سے اکاؤنٹ ہے؟{' '}
              <Link to="/login" className="text-[#0f9d58] hover:text-[#14b86b] transition-colors font-semibold">
                لاگ ان کریں
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
