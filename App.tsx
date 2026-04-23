
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Warehouse, 
  Map as MapIcon, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Bell, 
  Settings,
  Truck,
  ChevronRight,
  Database,
  User as UserIcon,
  LogOut
} from 'lucide-react';

// Components
import DashboardView from './components/DashboardView';
import WarehouseNetworkView from './components/WarehouseNetworkView';
import WarehouseDetailView from './components/WarehouseDetailView';
import RouteOptimizationView from './components/RouteOptimizationView';
import ForecastingView from './components/ForecastingView';
import SimulationView from './components/SimulationView';
import ComparisonView from './components/ComparisonView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';

import { mockApi } from './services/mockApi';
import { User } from './types';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-200/50' 
          : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600 font-medium'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-orange-500'}`}>
          {icon}
        </div>
        <span className="font-bold text-sm">{label}</span>
      </div>
      {isActive && <ChevronRight size={14} className="animate-pulse" />}
    </Link>
  );
};

const Header: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1200);
    };
    window.addEventListener('db-sync', handleSync);
    return () => window.removeEventListener('db-sync', handleSync);
  }, []);

  return (
    <header className="h-20 border-b border-orange-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Pulse<span className="text-orange-500">Logix</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${isSyncing ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-100'}`}>
          <Database size={14} className={isSyncing ? 'text-orange-500 animate-spin' : 'text-emerald-500'} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${isSyncing ? 'text-orange-700' : 'text-emerald-700'}`}>
            {isSyncing ? 'Auto-Syncing...' : 'MongoDB Persistent'}
          </span>
        </div>
        
        <button className="p-2.5 text-slate-500 hover:text-orange-500 transition-all relative rounded-full hover:bg-orange-50">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-4 pl-6 border-l border-slate-200 group hover:bg-orange-50/50 transition-all py-1.5 px-3 rounded-2xl"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">{user?.name || 'Guest'}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{user?.role || 'Guest'}</p>
            </div>
            <div className="w-10 h-10 orange-gradient rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
              {(user?.name || 'G').charAt(0).toUpperCase()}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-4 w-56 bg-white border border-orange-100 rounded-[1.5rem] shadow-2xl py-2 z-50 animate-in-fade">
              <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-orange-50 text-slate-600 hover:text-orange-600 font-bold text-sm transition-all">
                <UserIcon size={18} /> View Profile
              </Link>
              <Link to="/settings" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-orange-50 text-slate-600 hover:text-orange-600 font-bold text-sm transition-all">
                <Settings size={18} /> Settings
              </Link>
              <div className="h-px bg-slate-50 my-1 mx-4"></div>
              <button 
                onClick={() => { setShowDropdown(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-sm transition-all"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.initializeDatabase();
    setUser(mockApi.getCurrentUser());
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await mockApi.logout();
    setUser(null);
  };

  if (loading) return null;

  if (!user) {
    return <AuthView onLoginSuccess={() => setUser(mockApi.getCurrentUser())} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#fefefe]">
        <aside className="w-72 border-r border-orange-50 bg-white flex flex-col p-6 space-y-2 sticky top-0 h-screen overflow-y-auto">
          <div className="mb-10 px-2 flex items-center gap-3">
            <div className="orange-gradient p-2.5 rounded-2xl text-white shadow-xl shadow-orange-200">
              <Truck size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 block">Pulse</span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none">Smart Supply</span>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1.5">
            <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <SidebarItem to="/network" icon={<Warehouse size={20} />} label="Warehouses" />
            <SidebarItem to="/routes" icon={<MapIcon size={20} />} label="Shipping Routes" />
            <SidebarItem to="/forecasting" icon={<TrendingUp size={20} />} label="Predict Sales" />
            <SidebarItem to="/simulation" icon={<Zap size={20} />} label="Test Scenarios" />
            <SidebarItem to="/comparison" icon={<BarChart3 size={20} />} label="Compare Results" />
          </nav>

          <div className="pt-6 border-t border-slate-100 space-y-1.5">
            <SidebarItem to="/profile" icon={<UserIcon size={20} />} label="Profile" />
            <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
          </div>
          
          <div className="mt-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-200">
            <p className="text-[11px] font-black text-orange-900 mb-1 tracking-widest">LIVE DATABASE</p>
            <p className="text-[11px] text-slate-700 leading-relaxed font-medium">Session sync active for {user.name.toUpperCase()}.</p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative min-w-0">
          <Header user={user} onLogout={handleLogout} />
          <div className="p-8 lg:p-12 overflow-y-auto h-[calc(100vh-80px)]">
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/network" element={<WarehouseNetworkView />} />
              <Route path="/network/:id" element={<WarehouseDetailView />} />
              <Route path="/routes" element={<RouteOptimizationView />} />
              <Route path="/forecasting" element={<ForecastingView />} />
              <Route path="/simulation" element={<SimulationView />} />
              <Route path="/comparison" element={<ComparisonView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="*" element={<DashboardView />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
