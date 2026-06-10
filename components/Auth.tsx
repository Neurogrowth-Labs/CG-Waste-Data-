import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Building2, Globe, FileCheck,
  ChevronRight, Check, AlertTriangle, Mail, Loader2,
  Eye, EyeOff, ArrowRight, Leaf, BarChart3, Recycle,
  Smartphone, Fingerprint
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AuthProps {
  onLogin: (user: User) => void;
}

const STEPS = [
  { id: 1, label: 'Identity' },
  { id: 2, label: 'Organization' },
  { id: 3, label: 'Compliance' },
  { id: 4, label: 'Security' }
];

const ISO_STANDARDS = [
  { id: 'iso14001', label: 'ISO 14001 (Environment)', icon: Globe },
  { id: 'iso9001', label: 'ISO 9001 (Quality)', icon: FileCheck },
  { id: 'iso27001', label: 'ISO 27001 (Security)', icon: Lock },
  { id: 'esg', label: 'ESG Reporting', icon: Building2 },
];

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    signupPassword: '', 
    fullName: '',
    orgName: '',
    role: 'manager',
    jurisdiction: 'USA',
    standards: [] as string[],
    mfaMethod: 'app'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      // onLogin will be handled by the session listener in App.tsx
    } catch (err: any) {
      console.error(err);
      
      const msg = err.message || '';
      
      if (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('invalid-credential')) {
          setError('Invalid credentials.');
      } else {
          setError(msg || 'Login failed');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setError(null);

    // Step 1 Validation: Identity
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setError("Please enter your full legal name.");
        return;
      }
      if (!formData.email.trim()) {
        setError("Please enter your work email.");
        return;
      }
      if (!formData.signupPassword || formData.signupPassword.length < 8) {
        setError("Please enter a password of at least 8 characters.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    // Step 2 Validation: Organization
    if (step === 2) {
      if (!formData.orgName.trim()) {
        setError("Organization Name is required.");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSignupComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.signupPassword,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
            organization: formData.orgName,
            jurisdiction: formData.jurisdiction,
            standards: formData.standards,
            mfa_method: formData.mfaMethod
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (data?.user) {
        const { error: profileError } = await supabase.from('users').upsert({
           id: data.user.id,
           email: formData.email,
           full_name: formData.fullName,
           role: formData.role,
           organization: formData.orgName,
           jurisdiction: formData.jurisdiction,
           standards: formData.standards,
           mfa_method: formData.mfaMethod
        });

        if (profileError) {
           console.error("Failed to crate supabase user profile", profileError);
        }
        
        if (!data.session) {
          setError("Registration successful! Please check your email to verify your account.");
        }
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err.message || '';
      if (msg.toLowerCase().includes('email-already-in-use')) {
         setError('This email is already in use. Please log in instead.');
      } else {
         setError(msg || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStandard = (id: string) => {
    setFormData(prev => ({
      ...prev,
      standards: prev.standards.includes(id) 
        ? prev.standards.filter(s => s !== id)
        : [...prev.standards, id]
    }));
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      
      {/* Left Panel: Brand & Industry Showcase */}
      <div className="hidden lg:flex flex-col w-[45%] xl:w-[50%] relative overflow-y-auto custom-scrollbar bg-[#071A2E] text-white custom-scrollbar-hide">
        {/* Background Image & Overlay */}
        <div className="fixed top-0 left-0 w-[45%] xl:w-[50%] h-full z-0 pointer-events-none">
           <img 
              src="https://images.unsplash.com/photo-1541888087405-eb81f1f2022f?auto=format&fit=crop&w=1920&q=80" 
              alt="Demolition Site" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-gradient-to-br from-[#071A2E]/95 via-[#00A76F]/70 to-[#00C2A8]/50 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex flex-col p-10 xl:p-14 min-h-full">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 mb-10 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00A76F] to-[#00C2A8] rounded-xl flex items-center justify-center shadow-lg shadow-[#00A76F]/20">
               <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
               <span className="block text-xl font-extrabold tracking-tight text-white leading-none">CG WASTE DATA</span>
               <span className="block text-[10px] font-medium text-emerald-200/80 tracking-widest uppercase mt-1">Enterprise Construction Intelligence</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="max-w-xl mb-12 shrink-0">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-5 leading-tight text-white">
              Smart Waste Solutions.<br/>
              <span className="text-[#00C2A8]">Greener Construction.</span>
            </h1>
            <p className="text-lg text-emerald-50/80 font-medium leading-relaxed max-w-lg">
              Transform demolition waste into sustainable opportunities through AI-powered tracking, material recovery analytics, and green building design intelligence.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4 mb-12 flex-1">
             {/* Feature 1 */}
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-all hover:-translate-y-0.5">
                <div className="p-3 bg-[#00A76F]/20 rounded-xl text-[#00C2A8] shrink-0">
                   <Recycle className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-lg mb-1.5">Building Demolition Waste Management</h3>
                   <div className="flex flex-wrap gap-2 text-xs text-emerald-100/70">
                     <span className="px-2 py-1 bg-white/5 rounded-md">Waste tracking</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">Material recovery</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">Recycling optimization</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">Carbon reduction</span>
                   </div>
                </div>
             </div>

             {/* Feature 2 */}
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-all hover:-translate-y-0.5">
                <div className="p-3 bg-[#00A76F]/20 rounded-xl text-[#00C2A8] shrink-0">
                   <Leaf className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-lg mb-1.5">Green Building Design</h3>
                   <div className="flex flex-wrap gap-2 text-xs text-emerald-100/70">
                     <span className="px-2 py-1 bg-white/5 rounded-md">Sustainable design insights</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">LEED-ready</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">Circular material planning</span>
                   </div>
                </div>
             </div>

             {/* Feature 3 */}
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-all hover:-translate-y-0.5">
                <div className="p-3 bg-[#00A76F]/20 rounded-xl text-[#00C2A8] shrink-0">
                   <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="font-bold text-white text-lg mb-1.5">Construction Intelligence</h3>
                   <div className="flex flex-wrap gap-2 text-xs text-emerald-100/70">
                     <span className="px-2 py-1 bg-white/5 rounded-md">Real-time dashboards</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">Compliance monitoring</span>
                     <span className="px-2 py-1 bg-white/5 rounded-md">Predictive analytics</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Metrics & Compliance Footer */}
          <div className="shrink-0 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-5">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">92%</div>
                <div className="text-xs font-semibold text-[#00C2A8] uppercase tracking-wider">Material Recovery</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">48%</div>
                <div className="text-xs font-semibold text-[#00C2A8] uppercase tracking-wider">Carbon Reduction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">1.2M</div>
                <div className="text-xs font-semibold text-[#00C2A8] uppercase tracking-wider">Tons Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">500+</div>
                <div className="text-xs font-semibold text-[#00C2A8] uppercase tracking-wider">Green Projects</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-[10px] sm:text-xs font-medium text-emerald-100/60 uppercase tracking-widest">
               <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> ISO 27001</span>
               <span className="w-1 h-1 bg-emerald-500/50 rounded-full" />
               <span className="flex items-center"><Lock className="w-3.5 h-3.5 mr-1.5" /> SOC 2 Type II</span>
               <span className="w-1 h-1 bg-emerald-500/50 rounded-full" />
               <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1.5" /> LEED Integration</span>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel: Authentication Panel */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col min-h-screen bg-[#F8FAFC] relative overflow-y-auto custom-scrollbar">
         <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 max-w-3xl mx-auto w-full">
            
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden flex items-center space-x-3 mb-10">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00A76F] to-[#00C2A8] rounded-xl flex items-center justify-center shadow-lg">
                 <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                 <span className="block text-lg font-extrabold tracking-tight text-[#071A2E] leading-none">CG WASTE DATA</span>
                 <span className="block text-[9px] font-bold text-[#00A76F] tracking-widest uppercase mt-0.5">Enterprise App</span>
              </div>
            </div>

            {mode === 'login' ? (
              <div className="animate-fade-in w-full">
                 <div className="mb-10">
                    <p className="text-sm font-bold text-[#00A76F] mb-1.5 tracking-wide uppercase">Welcome Back</p>
                    <h2 className="text-3xl font-extrabold text-[#071A2E] tracking-tight mb-2">
                       Sign in to your Dashboard
                    </h2>
                    <p className="text-slate-500 font-medium">
                       Access demolition waste analytics, green building insights, and project intelligence.
                    </p>
                 </div>

                 {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start border border-red-100 shadow-sm">
                      <AlertTriangle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-red-500" />
                      <div>
                        <span className="block font-semibold">Authentication Error</span>
                        <span className="block mt-0.5 text-red-600">{error}</span>
                      </div>
                    </div>
                  )}

                 <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
                      <div className="relative group">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-[#00A76F] transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none transition-all text-[#071A2E] font-medium shadow-sm"
                          placeholder="Enter your company email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                      <div className="relative group">
                        <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-[#00A76F] transition-colors" />
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none transition-all text-[#071A2E] font-medium shadow-sm"
                          placeholder="Enter your password"
                        />
                        <button 
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                           {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 pb-2">
                       <label className="flex items-center select-none cursor-pointer group">
                          <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors mr-2 ${rememberMe ? 'bg-[#00A76F] border-[#00A76F]' : 'border-slate-300 group-hover:border-[#00A76F]'}`}>
                             {rememberMe && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="hidden" />
                          <span className="text-sm font-medium text-slate-600">Remember me</span>
                       </label>
                       
                       <button type="button" className="text-sm font-bold text-[#00A76F] hover:text-[#00C2A8] transition-colors">
                          Forgot Password?
                       </button>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#00A76F] hover:bg-gradient-to-r hover:from-[#00A76F] hover:to-[#00C2A8] text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center disabled:opacity-70 shadow-lg shadow-[#00A76F]/25 group"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                         <div className="flex items-center">
                            Access Dashboard
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                         </div>
                      )}
                    </button>
                 </form>

                 <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                       <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                       <span className="px-4 bg-[#F8FAFC] text-slate-400 font-bold tracking-wider text-[11px] uppercase">OR CONTINUE WITH</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-10">
                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center shadow-sm disabled:opacity-70"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google
                    </button>
                    <button 
                      type="button"
                      disabled={loading}
                      className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center shadow-sm disabled:opacity-70"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                          <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                          <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                          <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                      </svg>
                      Azure AD
                    </button>
                 </div>

                 {/* Sign-Up Card */}
                 <div className="bg-white/40 border border-[#00A76F]/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start justify-between backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00A76F]/5 to-transparent pointer-events-none" />
                    
                    <div className="flex items-start space-x-4 relative z-10 sm:max-w-[65%] mb-5 sm:mb-0">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-[#00A76F]/20 shadow-sm shrink-0">
                          <Leaf className="w-6 h-6 text-[#00A76F]" />
                       </div>
                       <div className="text-center sm:text-left">
                          <h4 className="text-lg font-bold text-[#071A2E] mb-1">New to CG Waste Data?</h4>
                          <p className="text-xs sm:text-sm text-slate-500 font-medium">Create an enterprise account and start managing demolition waste, recycling workflows, and sustainable building initiatives.</p>
                       </div>
                    </div>
                    
                    <button 
                      onClick={() => setMode('signup')}
                      className="w-full sm:w-auto relative z-10 shrink-0 px-6 py-3 bg-white text-[#00A76F] border border-[#00A76F]/30 hover:border-[#00A76F] rounded-xl font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                    >
                      Create Enterprise Account
                    </button>
                 </div>
              </div>
            ) : (
              <div className="animate-fade-in w-full">
                 <div className="mb-10 flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-[#00A76F] mb-1.5 tracking-wide uppercase">Enterprise Onboarding</p>
                       <h2 className="text-3xl font-extrabold text-[#071A2E] tracking-tight mb-2">
                          Create Account
                       </h2>
                    </div>
                    <button onClick={() => setMode('login')} className="text-sm font-bold text-slate-500 hover:text-[#00A76F] transition-colors">
                       Cancel & Login
                    </button>
                 </div>

                 {/* Wizard Container */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col sm:flex-row min-h-[450px]">
                    {/* Sidebar Steps */}
                    <div className="w-full sm:w-48 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-200 p-6 flex flex-col shrink-0">
                       <nav className="space-y-4">
                         {STEPS.map((s) => (
                           <div key={s.id} className="flex items-center space-x-3">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                                step > s.id 
                                  ? 'bg-[#00A76F] border-[#00A76F] text-white' 
                                  : step === s.id
                                    ? 'border-[#00A76F] text-[#00A76F] bg-white'
                                    : 'bg-transparent border-slate-300 text-slate-400'
                              }`}>
                                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                              </div>
                              <span className={`text-sm font-bold ${step >= s.id ? 'text-[#071A2E]' : 'text-slate-400'}`}>
                                {s.label}
                              </span>
                           </div>
                         ))}
                       </nav>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col">
                       {error && (
                         <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start border border-red-100">
                           <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-red-500" />
                           <span className="font-medium">{error}</span>
                         </div>
                       )}

                       <div className="flex-1">
                          {step === 1 && (
                             <div className="space-y-5 animate-fade-in">
                               <div>
                                  <h3 className="text-lg font-bold text-[#071A2E]">Identity Verification</h3>
                                  <p className="text-sm text-slate-500 font-medium">Establish your digital identity for audit traceability.</p>
                               </div>
                               <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Legal Name</label>
                                    <input 
                                      type="text" 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none text-[#071A2E] font-medium" 
                                      placeholder="John Doe"
                                      value={formData.fullName}
                                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email</label>
                                    <input 
                                      type="email" 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none text-[#071A2E] font-medium" 
                                      placeholder="name@company.com"
                                      value={formData.email}
                                      onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Create Password</label>
                                    <input 
                                      type="password" 
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none text-[#071A2E] font-medium" 
                                      placeholder="Min. 8 characters"
                                      value={formData.signupPassword}
                                      onChange={e => setFormData({...formData, signupPassword: e.target.value})}
                                    />
                                  </div>
                               </div>
                             </div>
                          )}

                          {step === 2 && (
                             <div className="space-y-5 animate-fade-in">
                               <div>
                                  <h3 className="text-lg font-bold text-[#071A2E]">Organization & Role</h3>
                                  <p className="text-sm text-slate-500 font-medium">Define your access level and jurisdiction.</p>
                               </div>
                               <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization Name</label>
                                    <div className="relative">
                                      <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                      <input 
                                        type="text" 
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none text-[#071A2E] font-medium" 
                                        placeholder="Company Ltd."
                                        value={formData.orgName}
                                        onChange={e => setFormData({...formData, orgName: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role Type</label>
                                    <select 
                                      value={formData.role}
                                      onChange={e => setFormData({...formData, role: e.target.value})}
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none text-[#071A2E] font-medium"
                                    >
                                      <option value="manager">Site Manager / Contractor</option>
                                      <option value="transporter">Waste Operator / Transporter</option>
                                      <option value="recycler">Recycling Facility</option>
                                      <option value="executive">Executive / Developer</option>
                                      <option value="regulator">Government / Regulator</option>
                                      <option value="investor">Investor / ESG Auditor</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jurisdiction</label>
                                    <select 
                                      value={formData.jurisdiction}
                                      onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A76F]/20 focus:border-[#00A76F] outline-none text-[#071A2E] font-medium"
                                    >
                                      <option value="USA">United States</option>
                                      <option value="UK">United Kingdom</option>
                                      <option value="EU">European Union</option>
                                      <option value="GLOBAL">Global / Remote</option>
                                    </select>
                                  </div>
                               </div>
                             </div>
                          )}

                          {step === 3 && (
                             <div className="space-y-5 animate-fade-in">
                               <div>
                                  <h3 className="text-lg font-bold text-[#071A2E]">Regulatory Context</h3>
                                  <p className="text-sm text-slate-500 font-medium">Select applicable frameworks for compliance tracking.</p>
                               </div>
                               <div className="grid grid-cols-1 gap-3">
                                 {ISO_STANDARDS.map(std => (
                                   <button
                                     key={std.id}
                                     onClick={() => toggleStandard(std.id)}
                                     className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                                       formData.standards.includes(std.id)
                                         ? 'border-[#00A76F] bg-[#00A76F]/5 shadow-sm'
                                         : 'border-slate-200 bg-slate-50 hover:border-[#00C2A8]'
                                     }`}
                                   >
                                     <div className="flex items-center space-x-3">
                                       <div className={`p-2 rounded-lg ${formData.standards.includes(std.id) ? 'bg-white text-[#00A76F] shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                                         <std.icon className="w-5 h-5" />
                                       </div>
                                       <span className={`text-sm font-bold ${formData.standards.includes(std.id) ? 'text-[#00A76F]' : 'text-slate-700'}`}>
                                         {std.label}
                                       </span>
                                     </div>
                                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.standards.includes(std.id) ? 'border-[#00A76F] bg-[#00A76F]' : 'border-slate-300'}`}>
                                        {formData.standards.includes(std.id) && <Check className="w-3 h-3 text-white" />}
                                     </div>
                                   </button>
                                 ))}
                               </div>
                             </div>
                          )}

                          {step === 4 && (
                             <div className="space-y-5 animate-fade-in">
                               <div>
                                  <h3 className="text-lg font-bold text-[#071A2E]">Security Hardening</h3>
                                  <p className="text-sm text-slate-500 font-medium">Secure your account with Multi-Factor Authentication.</p>
                               </div>
                               <div className="space-y-3">
                                  <button 
                                    onClick={() => setFormData({...formData, mfaMethod: 'app'})}
                                    className={`w-full p-4 border rounded-xl flex items-center justify-between text-left transition-all ${formData.mfaMethod === 'app' ? 'border-[#00A76F] bg-[#00A76F]/5' : 'border-slate-200 bg-slate-50'}`}
                                  >
                                     <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 shadow-sm ${formData.mfaMethod === 'app' ? 'bg-white text-[#00A76F]' : 'bg-slate-200 text-slate-500'}`}>
                                           <Smartphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                           <div className={`text-sm font-bold ${formData.mfaMethod === 'app' ? 'text-[#00A76F]' : 'text-slate-700'}`}>Authenticator App</div>
                                           <div className="text-xs text-slate-500 font-medium mt-0.5">Google Auth, Authy, MS Auth</div>
                                        </div>
                                     </div>
                                     {formData.mfaMethod === 'app' && <Check className="w-5 h-5 text-[#00A76F]" />}
                                  </button>

                                  <button 
                                    onClick={() => setFormData({...formData, mfaMethod: 'bio'})}
                                    className={`w-full p-4 border rounded-xl flex items-center justify-between text-left transition-all ${formData.mfaMethod === 'bio' ? 'border-[#00A76F] bg-[#00A76F]/5' : 'border-slate-200 bg-slate-50'}`}
                                  >
                                     <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 shadow-sm ${formData.mfaMethod === 'bio' ? 'bg-white text-[#00A76F]' : 'bg-slate-200 text-slate-500'}`}>
                                           <Fingerprint className="w-5 h-5" />
                                        </div>
                                        <div>
                                           <div className={`text-sm font-bold ${formData.mfaMethod === 'bio' ? 'text-[#00A76F]' : 'text-slate-700'}`}>Hardware Key / Bio</div>
                                           <div className="text-xs text-slate-500 font-medium mt-0.5">YubiKey, TouchID, Windows Hello</div>
                                        </div>
                                     </div>
                                     {formData.mfaMethod === 'bio' && <Check className="w-5 h-5 text-[#00A76F]" />}
                                  </button>
                               </div>
                               <div className="pt-2">
                                  <p className="text-xs text-slate-500 font-medium text-center">
                                     By clicking Complete, you agree to the <span className="text-[#00A76F] cursor-pointer hover:underline">Terms</span> & <span className="text-[#00A76F] cursor-pointer hover:underline">Privacy</span>.
                                  </p>
                               </div>
                             </div>
                          )}
                       </div>
                       
                       <div className="mt-8 pt-5 border-t border-slate-200 flex justify-between items-center bg-white shrink-0">
                          <button 
                            onClick={() => step > 1 ? setStep(step - 1) : setMode('login')} 
                            className="text-slate-500 hover:text-slate-800 font-bold px-4 py-2 transition-colors text-sm"
                          >
                            {step > 1 ? 'Back' : 'Cancel'}
                          </button>
                          
                          <button 
                            onClick={() => step === 4 ? handleSignupComplete() : handleNextStep()}
                            disabled={loading}
                            className="bg-[#00A76F] hover:bg-[#00C2A8] text-white px-6 py-2.5 rounded-xl font-bold shadow-md flex items-center transition-all disabled:opacity-70 text-sm"
                          >
                             {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                             {step === 4 ? 'Complete Setup' : 'Continue'}
                             {!loading && step < 4 && <ChevronRight className="w-4 h-4 ml-1.5" />}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Enterprise Features Footer */}
            <div className="mt-auto pt-10 pb-4">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
                 <div className="flex items-center space-x-3 text-slate-600">
                    <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#00A76F] opacity-90 p-2 bg-[#00A76F]/10 rounded-xl" />
                    <div>
                       <div className="text-[12px] font-bold text-[#071A2E]">Secure & Trusted</div>
                       <div className="text-[11px] font-medium text-slate-500">Enterprise-grade security</div>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3 text-slate-600">
                    <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-[#00A76F] opacity-90 p-2 bg-[#00A76F]/10 rounded-xl" />
                    <div>
                       <div className="text-[12px] font-bold text-[#071A2E]">AI Waste Intelligence</div>
                       <div className="text-[11px] font-medium text-slate-500">Automated classification</div>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3 text-slate-600">
                    <Leaf className="w-8 h-8 md:w-10 md:h-10 text-[#00A76F] opacity-90 p-2 bg-[#00A76F]/10 rounded-xl" />
                    <div>
                       <div className="text-[12px] font-bold text-[#071A2E]">Sustainable Impact</div>
                       <div className="text-[11px] font-medium text-slate-500">Realtime ESG performance</div>
                    </div>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
