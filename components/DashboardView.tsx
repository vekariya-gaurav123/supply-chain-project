import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Truck, 
  Activity, 
  AlertCircle,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ComposedChart, 
  Area,
  Line
} from 'recharts';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DemandData, Warehouse, ShippingRoute } from '../types';

const KPICard: React.FC<{ 
  title: string; 
  value: string; 
  trend: string; 
  trendDir: 'up' | 'down';
  icon: React.ReactNode; 
  primary?: boolean;
}> = ({ title, value, trend, trendDir, icon, primary }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.04)] hover-float relative overflow-hidden group">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl ${primary ? 'orange-gradient text-white' : 'bg-orange-50 text-orange-600'} transition-all duration-500 shadow-sm`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full ${trendDir === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trendDir === 'up' ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
        {trend}
      </div>
    </div>
    <div className="mt-6">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

const DashboardView: React.FC = () => {
  const [allDemand, setAllDemand] = useState<DemandData[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [routes, setRoutes] = useState<ShippingRoute[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState(2025);
  const [compareYear, setCompareYear] = useState<number | null>(null);

  const fetchData = async () => {
    setIsRefreshing(true);
    const [demand, whs, rs] = await Promise.all([
      api.getDemand(),
      api.getWarehouses(),
      api.getRoutes()
    ]);
    setAllDemand(demand);
    setWarehouses(whs);
    setRoutes(rs);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    fetchData();
    // Re-fetch automatically whenever a change is detected in the database
    window.addEventListener('db-sync', fetchData);
    return () => window.removeEventListener('db-sync', fetchData);
  }, []);

  const totalStock = warehouses.reduce((acc, curr) => acc + curr.currentStock, 0);
  const totalTransit = routes.reduce((acc, curr) => acc + curr.activeVolume, 0);

  const sortedRecentRoutes = useMemo(() => {
    return [...routes]
      .filter(r => r.activeVolume > 0)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);
  }, [routes]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => {
      const current = allDemand.find(d => d.month === month && d.year === selectedYear);
      const comparison = compareYear ? allDemand.find(d => d.month === month && d.year === compareYear) : null;
      return {
        month,
        actual: current?.actual || 0,
        forecast: current?.forecast || 0,
        compareActual: comparison?.actual || 0
      };
    });
  }, [allDemand, selectedYear, compareYear]);

  return (
    <div className={`space-y-10 animate-in-fade ${isRefreshing ? 'opacity-80' : 'opacity-100'} transition-opacity pb-20`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-orange-600 fill-orange-600" />
            <span className="text-xs font-black text-orange-600 uppercase tracking-[0.2em]">Operational Pulse</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Command <span className="text-orange-500">Center</span></h2>
          <p className="text-slate-600 font-bold mt-1">Real-time inventory mapping and transit intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard title="Total Items" value={`${(totalStock / 1000).toFixed(1)}k`} trend="8.4%" trendDir="up" icon={<Package size={24} />} primary />
        <KPICard title="On The Way" value={totalTransit.toLocaleString()} trend="1.2%" trendDir="down" icon={<Truck size={24} />} />
        <KPICard title="Order Health" value="99.1%" trend="0.5%" trendDir="up" icon={<Activity size={24} />} />
        <KPICard title="Risk Level" value="Low" trend="15%" trendDir="down" icon={<AlertCircle size={24} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Main Chart Section */}
        <div className="xl:col-span-8 space-y-10">
          <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_15px_60px_rgba(249,115,22,0.06)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Demand Velocity Forecast</h3>
               <div className="flex items-center gap-4">
                  <select 
                    className="bg-[#fffcf9] border border-orange-200 rounded-xl px-4 py-2 text-xs font-black uppercase outline-none focus:ring-4 focus:ring-orange-500/10 cursor-pointer"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {[2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
               </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fee2e2" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dx={-15} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="actual" name="Actual Sales" stroke="#f97316" strokeWidth={4} fill="url(#actualGrad)" />
                  <Line type="monotone" dataKey="forecast" name="AI Prediction" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Inventory Table */}
          <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.04)] overflow-hidden">
            <div className="p-8 border-b border-orange-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Warehouse Allocation Detail</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live items count per node</p>
              </div>
              <Activity size={20} className="text-orange-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#fffcf9] text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-orange-50">
                    <th className="px-8 py-4">Facility Name</th>
                    <th className="px-8 py-4">Current Stock</th>
                    <th className="px-8 py-4">Utilization</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50/50">
                  {warehouses.map(wh => (
                    <tr key={wh.id} className="hover:bg-orange-50/20 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Package size={16} />
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{wh.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-700 text-sm">{wh.currentStock.toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{width: `${(wh.currentStock/wh.capacity)*100}%`}}></div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{Math.round((wh.currentStock/wh.capacity)*100)}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${wh.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-700'}`}>
                           {wh.status}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Monitor Panel */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
             {/* Background watermark */}
             <div className="absolute top-1/2 right-0 -translate-y-1/2 p-6 opacity-[0.03] pointer-events-none scale-150 transform rotate-12">
               <Truck size={240} strokeWidth={1} />
             </div>

             <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-black tracking-tight mb-8">Active Transit Log</h3>
                
                <div className="flex-1 space-y-4">
                  {sortedRecentRoutes.map(route => (
                    <div key={route.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all cursor-default">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">{route.mode} Shipment</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                          <Clock size={10} /> {route.leadTimeDays}D ETA
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[12px] font-bold text-slate-100 truncate">{route.originId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <ArrowRight size={12} className="text-slate-500" strokeWidth={3} />
                             <p className="text-[12px] font-bold text-slate-100 truncate">{route.destinationId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-white leading-none tracking-tighter">
                            {route.activeVolume.toLocaleString()}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">units</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {sortedRecentRoutes.length === 0 && (
                    <div className="py-20 text-center">
                      <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                        <Activity size={32} className="text-slate-600" />
                      </div>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">No Active Deployments</p>
                    </div>
                  )}
                </div>

                <Link 
                  to="/routes"
                  className="w-full mt-10 py-5 bg-white/10 hover:bg-orange-500 hover:text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  View Full Logistics Manifest
                  <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={16} className="text-orange-500" /> Regional Density
              </h4>
              <div className="space-y-6">
                {['California', 'Illinois', 'Texas', 'New Jersey'].map(reg => {
                  const regStock = warehouses.filter(w => w.region.includes(reg)).reduce((a, b) => a + b.currentStock, 0);
                  const total = warehouses.reduce((a, b) => a + b.currentStock, 0);
                  const pct = total > 0 ? (regStock / total) * 100 : 0;
                  return (
                    <div key={reg}>
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                        <span className="text-slate-500">{reg}</span>
                        <span className="text-slate-900">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full orange-gradient" style={{width: `${pct}%`}}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
