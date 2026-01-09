
import React from 'react';
import { View, User } from '../types';
import { LayoutDashboard, Building2, Activity, Brain, Palette, Settings, Menu, X, Globe, LogOut, Leaf, ChevronRight } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.PROJECTS, label: 'Projects', icon: Building2 },
    { id: View.TRACKING, label: 'Waste Tracking', icon: Activity },
    { id: View.EDGE, label: 'EDGE Consultant', icon: Leaf },
    { id: View.INTELLIGENCE, label: 'Intelligence', icon: Brain },
    { id: View.CREATIVE, label: 'Creative Studio', icon: Palette },
    // { id: View.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white rounded-md shadow-md">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 fixed md:relative z-40 w-64 h-full bg-slate-900 text-white flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CG Waste</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
            </div>
            <button onClick={onLogout} title="Logout">
              <LogOut className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white" />
            </button>
          </div>
          
          {/* App Verification Links - Mandatory for Google Cloud compliance */}
          <div className="mt-4 px-4 flex flex-col space-y-2 text-[10px] text-slate-500 border-t border-slate-800 pt-4">
             <a href="#" className="hover:text-slate-300 flex items-center"><ChevronRight className="w-3 h-3 mr-1"/> Privacy Policy</a>
             <a href="#" className="hover:text-slate-300 flex items-center"><ChevronRight className="w-3 h-3 mr-1"/> Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8">
           <h1 className="text-xl font-semibold text-slate-800">
             {navItems.find(i => i.id === currentView)?.label}
           </h1>
           <div className="flex items-center space-x-4">
             <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">v2.4.0 ({user.jurisdiction})</span>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
