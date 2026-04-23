
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Save, 
  RefreshCcw, 
  Sparkles, 
  Server, 
  Search, 
  Code,
  Trash2,
  AlertTriangle,
  FileJson
} from 'lucide-react';
import { mockApi } from '../services/mockApi';

const SettingsView: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [dbState, setDbState] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('warehouses');

  useEffect(() => {
    if (activeTab === 'backend') {
      mockApi.getRawDatabase().then(setDbState);
    }
  }, [activeTab]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  const handleNuke = async () => {
    if (confirm('CRITICAL ACTION: This will delete ALL records from your MongoDB instance. Proceed?')) {
      await mockApi.resetDatabase();
    }
  };

  const tabs = [
    { id: 'general', icon: <User size={18} />, label: 'Profile' },
    { id: 'backend', icon: <Database size={18} />, label: 'DB Explorer' },
    { id: 'notifs', icon: <Bell size={18} />, label: 'Alerts' },
    { id: 'security', icon: <Shield size={18} />, label: 'Security' },
  ];

  return (
    <div className="max-w-6xl space-y-10 animate-in-fade">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Settings size={16} className="text-orange-500" />
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Configuration Console</span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">System <span className="text-orange-500">Workspace</span></h2>
        <p className="text-slate-400 font-medium mt-1">Manage platform defaults and inspect the MERN data layer.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-[0_8px_30px_rgb(251,146,60,0.04)] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[700px]">
          {/* Settings Sidebar */}
          <div className="w-full md:w-72 border-r border-orange-50 bg-[#fffcf9] p-8 space-y-3">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                    : 'text-slate-400 hover:bg-orange-50 hover:text-orange-500'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            
            <div className="mt-12 p-6 bg-white rounded-3xl border border-orange-100 flex flex-col items-center text-center shadow-sm">
              <Sparkles size={24} className="text-orange-400 mb-3" />
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">MERN Integration</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-bold">Connected to simulated MongoDB Cluster 0.</p>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-10 lg:p-14 flex-1 space-y-12">
              {activeTab === 'general' && (
                <section className="space-y-8 animate-in-fade">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
                      <Settings size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Regional & Localization</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Currency</label>
                      <select className="w-full bg-[#fffcf9] border border-orange-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 font-bold cursor-pointer transition-all">
                        <option>USD - United States Dollar</option>
                        <option>EUR - Eurozone</option>
                        <option>GBP - British Pound</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Metrics</label>
                      <select className="w-full bg-[#fffcf9] border border-orange-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 font-bold cursor-pointer transition-all">
                        <option>Metric (km, kg, L)</option>
                        <option>Imperial (mi, lb, gal)</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'backend' && (
                <section className="space-y-8 animate-in-fade h-full flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                        <Database size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">Database Explorer</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live MongoDB Collection Inspector</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleNuke}
                        className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Nuke Collections"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        onClick={() => mockApi.getRawDatabase().then(setDbState)}
                        className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                        title="Refresh"
                      >
                        <RefreshCcw size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['warehouses', 'routes', 'demand'].map(col => (
                      <button
                        key={col}
                        onClick={() => setSelectedCollection(col)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedCollection === col 
                          ? 'bg-orange-500 text-white shadow-lg' 
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {col} <span className="ml-1 opacity-50">({dbState?.[col]?.length || 0})</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 bg-slate-900 rounded-[2rem] p-8 overflow-hidden flex flex-col border border-slate-800 shadow-inner relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Code size={14} /> JSON_VIEWER_{selectedCollection.toUpperCase()}
                      </div>
                      <div className="px-3 py-1 bg-white/5 text-white/40 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                        ReadOnly
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto custom-scrollbar font-mono text-xs text-orange-200/90 leading-relaxed whitespace-pre p-2">
                      {dbState ? JSON.stringify(dbState[selectedCollection], null, 2) : '// Loading cluster data...'}
                    </div>
                    
                    {/* Overlay Status */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                       <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Shard Primary</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Index Count</p>
                      <p className="text-2xl font-black text-slate-900">12</p>
                    </div>
                    <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Storage Usage</p>
                      <p className="text-2xl font-black text-slate-900">14.2 KB</p>
                    </div>
                    <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Write</p>
                      <p className="text-2xl font-black text-slate-900">Just now</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="p-10 lg:p-14 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-orange-500">
                  <FileJson size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Backup & Restore</p>
                  <p className="text-xs font-bold text-slate-700">Export your local MongoDB state to JSON.</p>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 text-white orange-gradient rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-orange-200 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} strokeWidth={3} />}
                  {isSaving ? 'Syncing...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
