
import React from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Warehouse,
  TrendingUp
} from 'lucide-react';

const ProfileStat: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.04)] hover-float">
    <div className={`p-3 rounded-2xl w-fit mb-4 ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

const ActivityItem: React.FC<{ title: string; time: string; icon: React.ReactNode }> = ({ title, time, icon }) => (
  <div className="flex items-center justify-between p-4 bg-[#fffcf9] rounded-2xl border border-orange-50 hover:border-orange-200 transition-all cursor-default">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-white rounded-xl shadow-sm text-orange-500">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
          <Clock size={10} /> {time}
        </p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-300" />
  </div>
);

const ProfileView: React.FC = () => {
  return (
    <div className="space-y-10 animate-in-fade pb-20">
      {/* Profile Hero */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 h-64 md:h-80 shadow-2xl">
        <div className="absolute inset-0 opacity-20 orange-gradient"></div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles size={240} className="text-white" />
        </div>
        
        <div className="absolute -bottom-12 left-12 flex items-end gap-8 z-10">
          <div className="w-32 h-32 md:w-44 md:h-44 orange-gradient rounded-[2.5rem] border-[8px] border-white flex items-center justify-center text-white text-5xl md:text-7xl font-black shadow-2xl">
            AM
          </div>
          <div className="mb-14 hidden md:block">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-4xl font-black text-white tracking-tight">Alex Miller</h2>
              <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={18} />
              </div>
            </div>
            <p className="text-orange-400 font-black uppercase tracking-[0.2em] text-xs">Senior Solutions Architect</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 lg:mt-20">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <User size={20} className="text-orange-500" /> Personal Identity
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-900">a.miller@pulselogix.io</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HQ Location</p>
                  <p className="text-sm font-bold text-slate-900">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                  <p className="text-sm font-bold text-slate-900">Digital Twin Engineering</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {['Supply Chain Modeling', 'AI Forecasting', 'Disruption Analytics', 'MERN Stack'].map(skill => (
                  <span key={skill} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-tighter">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Award size={100} fill="white" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-black tracking-tight mb-2">Architect Rating</h4>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-black text-orange-500">9.8</span>
                <span className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">Master Level</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-bold">
                Alex is in the top 1% of PulseLogix users, having optimized over 4,500 shipping routes this quarter.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProfileStat 
              label="System Uptime" 
              value="99.98%" 
              icon={<Zap size={20} fill="currentColor" />} 
              color="bg-orange-500 text-white" 
            />
            <ProfileStat 
              label="Scenarios Ran" 
              value="1,248" 
              icon={<Activity size={20} />} 
              color="bg-emerald-50 text-emerald-600" 
            />
            <ProfileStat 
              label="Opt. Accuracy" 
              value="94.2%" 
              icon={<CheckCircle2 size={20} />} 
              color="bg-slate-900 text-white" 
            />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Professional Summary</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Veteran Solutions Architect with over 12 years of experience in distributed systems and logistical digital twins. Currently leading the Supply Chain Intelligence initiative at PulseLogix, focusing on predictive demand modeling and real-time disruption simulation. Alex specializes in converting complex heuristic data into actionable architectural strategies that reduce operational overhead by an average of 18% per fiscal cycle.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent System Contributions</h3>
              <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">View All Activity</button>
            </div>
            
            <div className="space-y-4">
              <ActivityItem 
                title="Optimized 'West Coast -> Midwest' Corridor" 
                time="2 HOURS AGO" 
                icon={<Zap size={16} fill="currentColor" />} 
              />
              <ActivityItem 
                title="Executed 'Q3 Disruption' Simulation" 
                time="YESTERDAY" 
                icon={<Activity size={16} />} 
              />
              <ActivityItem 
                title="Updated Warehouse Capacity Thresholds" 
                time="2 DAYS AGO" 
                icon={<Warehouse size={16} />} 
              />
              <ActivityItem 
                title="Published New Demand Forecast Model" 
                time="4 DAYS AGO" 
                icon={<TrendingUp size={16} />} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
