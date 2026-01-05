
import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Building2, UserCheck, FileCheck, Globe, 
  ChevronRight, Check, AlertTriangle, Fingerprint, Smartphone, Mail
} from 'lucide-react';
import { User } from '../types';

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

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    orgName: '',
    role: 'manager',
    jurisdiction: 'USA',
    standards: [] as string[],
    mfaMethod: 'app'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: 'Demo User',
        email: formData.email || 'demo@cgwaste.com',
        role: 'manager',
        organization: 'Global Construction Inc.',
        jurisdiction: 'International',
        standards: ['ISO 14001', 'ISO 9001']
      });
    }, 1500);
  };

  const handleSignupComplete = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        organization: formData.orgName,
        jurisdiction: formData.jurisdiction,
        standards: formData.standards
      });
    }, 2000);
  };

  const toggleStandard = (id: string) => {
    setFormData(prev => ({
      ...prev,
      standards: prev.standards.includes(id) 
        ? prev.standards.filter(s => s !== id)
        : [...prev.standards, id]
    }));
  };

  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
          <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">CG Waste Data</h1>
            <p className="text-sm text-slate-500 mt-1">Secure Enterprise Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Verifying Identity...' : 'Secure Login'}
            </button>
            
            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setMode('signup')}
                className="text-sm text-green-700 font-medium hover:underline"
              >
                Start Enterprise Onboarding
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-center space-x-4">
              <div className="flex items-center text-xs text-slate-400">
                <Lock className="w-3 h-3 mr-1" /> ISO 27001
              </div>
              <div className="flex items-center text-xs text-slate-400">
                <ShieldCheck className="w-3 h-3 mr-1" /> SOC 2 Type II
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SIGN UP / ONBOARDING WIZARD
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar / Progress */}
        <div className="bg-slate-900 w-full md:w-64 p-8 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight">Onboarding</span>
            </div>
            
            <nav className="space-y-6 relative">
               {/* Connecting Line */}
               <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-800 -z-0"></div>
               
               {STEPS.map((s, i) => (
                 <div key={s.id} className="relative z-10 flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      step >= s.id 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-slate-900 border-slate-600 text-slate-400'
                    }`}>
                      {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                    </div>
                    <span className={`text-sm font-medium ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                      {s.label}
                    </span>
                 </div>
               ))}
            </nav>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
             <p className="text-xs text-slate-400 leading-relaxed">
               This secure onboarding process ensures compliance with ISO 27001 Access Control policies.
             </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Identity Verification</h2>
                   <p className="text-slate-500">Establish your digital identity for audit traceability.</p>
                </div>
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Full Legal Name</label>
                     <input 
                       type="text" 
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                       placeholder="John Doe"
                       value={formData.fullName}
                       onChange={e => setFormData({...formData, fullName: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                     <input 
                       type="email" 
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                       placeholder="john@construction-inc.com"
                       value={formData.email}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                     />
                   </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Organization & Role</h2>
                   <p className="text-slate-500">Define your access level and jurisdiction.</p>
                </div>
                <div className="space-y-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                     <div className="relative">
                       <Building2 className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                       <input 
                         type="text" 
                         className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                         placeholder="Company Ltd."
                         value={formData.orgName}
                         onChange={e => setFormData({...formData, orgName: e.target.value})}
                       />
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Role Type</label>
                     <select 
                       value={formData.role}
                       onChange={e => setFormData({...formData, role: e.target.value})}
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                     >
                       <option value="manager">Site Manager / Contractor</option>
                       <option value="transporter">Waste Operator / Transporter</option>
                       <option value="recycler">Recycling Facility</option>
                       <option value="executive">Executive / Developer</option>
                       <option value="regulator">Government / Regulator</option>
                       <option value="investor">Investor / ESG Auditor</option>
                     </select>
                     <p className="text-xs text-amber-600 mt-2 flex items-center">
                       <AlertTriangle className="w-3 h-3 mr-1" />
                       Gov/Investor roles require manual verification.
                     </p>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Jurisdiction</label>
                     <select 
                       value={formData.jurisdiction}
                       onChange={e => setFormData({...formData, jurisdiction: e.target.value})}
                       className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                     >
                       <option value="USA">United States</option>
                       <option value="UK">United Kingdom</option>
                       <option value="EU">European Union</option>
                       <option value="AFRICA_EA">East Africa (EAC)</option>
                       <option value="AFRICA_WA">West Africa (ECOWAS)</option>
                     </select>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900">Regulatory Context</h2>
                   <p className="text-slate-500">Select applicable frameworks for compliance tracking.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {ISO_STANDARDS.map(std => (
                    <button
                      key={std.id}
                      onClick={() => toggleStandard(std.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        formData.standards.includes(std.id)
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-slate-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${formData.standards.includes(std.id) ? 'bg-white text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                          <std.icon className="w-5 h-5" />
                        </div>
                        <span className={`font-medium ${formData.standards.includes(std.id) ? 'text-green-900' : 'text-slate-700'}`}>
                          {std.label}
                        </span>
                      </div>
                      {formData.standards.includes(std.id) && <Check className="w-5 h-5 text-green-600" />}
                    </button>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Acknowledgment</h4>
                  <label className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1 rounded text-blue-600" defaultChecked />
                    <span className="text-xs text-blue-800 leading-snug">
                      I acknowledge responsibility for data accuracy in accordance with the selected frameworks and ISO 9001 quality controls.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
               <div className="space-y-6 animate-fade-in">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-900">Security Hardening</h2>
                    <p className="text-slate-500">Secure your account with Multi-Factor Authentication (MFA).</p>
                 </div>

                 <div className="space-y-4">
                    <button 
                      onClick={() => setFormData({...formData, mfaMethod: 'app'})}
                      className={`w-full p-4 border rounded-xl flex items-center justify-between ${formData.mfaMethod === 'app' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                    >
                       <div className="flex items-center">
                          <Smartphone className="w-6 h-6 text-slate-600 mr-3" />
                          <div className="text-left">
                             <div className="font-semibold text-slate-900">Authenticator App</div>
                             <div className="text-xs text-slate-500">Google Auth, Authy, MS Auth</div>
                          </div>
                       </div>
                       {formData.mfaMethod === 'app' && <div className="px-2 py-1 bg-green-200 text-green-800 text-xs font-bold rounded">RECOMMENDED</div>}
                    </button>

                    <button 
                      onClick={() => setFormData({...formData, mfaMethod: 'bio'})}
                      className={`w-full p-4 border rounded-xl flex items-center justify-between ${formData.mfaMethod === 'bio' ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                    >
                       <div className="flex items-center">
                          <Fingerprint className="w-6 h-6 text-slate-600 mr-3" />
                          <div className="text-left">
                             <div className="font-semibold text-slate-900">Hardware Key / Bio</div>
                             <div className="text-xs text-slate-500">YubiKey, TouchID, Windows Hello</div>
                          </div>
                       </div>
                    </button>
                 </div>
                 
                 <div className="pt-4 text-center">
                    <p className="text-xs text-slate-400">
                       By clicking Complete, you agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                 </div>
               </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
              >
                Back
              </button>
            ) : (
              <button 
                onClick={() => setMode('login')}
                className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2"
              >
                Cancel
              </button>
            )}
            
            <button 
              onClick={() => step < 4 ? setStep(step + 1) : handleSignupComplete()}
              disabled={loading || (step === 1 && !formData.email)}
              className="bg-slate-900 text-white px-8 py-2 rounded-lg font-medium hover:bg-slate-800 flex items-center shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Finalizing...' : step === 4 ? 'Complete Onboarding' : 'Continue'}
              {!loading && step < 4 && <ChevronRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
