
import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Area, Line
} from 'recharts';
import { 
  TrendingUp, 
  Plus, 
  X, 
  Calendar, 
  Package, 
  Layers, 
  History,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { DemandData } from '../types';
import { mockApi } from '../services/mockApi';

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DemandData) => void;
  initialData?: DemandData | null;
  defaultYear: number;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ isOpen, onClose, onSubmit, initialData, defaultYear }) => {
  const [month, setMonth] = useState('Jan');
  const [year, setYear] = useState(defaultYear);
  const [actual, setActual] = useState(0);
  const [forecast, setForecast] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setMonth(initialData.month);
        setYear(initialData.year);
        setActual(initialData.actual);
        setForecast(initialData.forecast);
      } else {
        setMonth('Jan');
        setYear(defaultYear);
        setActual(0);
        setForecast(0);
      }
    }
  }, [isOpen, initialData, defaultYear]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in-fade" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl relative border border-orange-50 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-3 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 text-white rounded-xl shadow-md">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                {initialData ? 'Update Entry' : 'New Log Entry'}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data Input Terminal</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-orange-500 transition-colors p-1.5 hover:bg-orange-50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={10} className="text-orange-500" /> Fiscal Year
              </label>
              <input 
                type="number"
                className="w-full px-3 py-2.5 bg-[#fffcf9] border border-orange-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 text-sm"
                value={year}
                onChange={e => setYear(parseInt(e.target.value) || 2025)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={10} className="text-orange-500" /> Month
              </label>
              <div className="relative">
                <select 
                  className="w-full px-3 py-2.5 bg-[#fffcf9] border border-orange-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-slate-900 text-sm appearance-none cursor-pointer"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                >
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Package size={10} className="text-orange-500" /> Actual Units Sold
            </label>
            <input 
              type="number" 
              className="w-full px-4 py-3 bg-[#fffcf9] border border-orange-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-lg text-slate-900"
              placeholder="0"
              value={actual}
              onChange={e => setActual(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp size={10} className="text-orange-500" /> Forecast Target
            </label>
            <input 
              type="number" 
              className="w-full px-4 py-3 bg-[#fffcf9] border border-orange-100 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-black text-lg text-slate-900"
              placeholder="0"
              value={forecast}
              onChange={e => setForecast(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 text-slate-500 font-bold hover:text-slate-900 transition-colors uppercase text-[9px] tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit({ year, month, actual, forecast })} 
            className="flex-[1.5] py-2.5 text-white orange-gradient rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={14} />
            {initialData ? 'Save Changes' : 'Confirm Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ForecastingView: React.FC = () => {
  const [allData, setAllData] = useState<DemandData[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [compareYear, setCompareYear] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'yearly' | 'timeline'>('yearly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    mockApi.getDemand().then(data => {
      setAllData(data);
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  useEffect(() => {
    refreshData();
    // Re-fetch automatically on database changes
    window.addEventListener('db-sync', refreshData);
    return () => window.removeEventListener('db-sync', refreshData);
  }, []);

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>(allData.map(d => d.year));
    if (yearsSet.size === 0) {
      yearsSet.add(2024);
      yearsSet.add(2025);
    }
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [allData]);

  const handleAddOrUpdateData = async (newData: DemandData) => {
    const existingIndex = allData.findIndex(d => d.month === newData.month && d.year === newData.year);
    let updatedData = [...allData];
    
    if (existingIndex >= 0) {
      updatedData[existingIndex] = newData;
    } else {
      updatedData.push(newData);
    }
    
    await mockApi.updateDemand(updatedData);
    setAllData(updatedData);
    setSelectedYear(newData.year);
    setIsModalOpen(false);
  };

  const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = useMemo(() => {
    if (viewMode === 'yearly') {
      return monthsOrder.map(m => {
        const record = allData.find(d => d.month === m && d.year === selectedYear);
        const comparison = compareYear ? allData.find(d => d.month === m && d.year === compareYear) : null;
        return {
          month: m,
          actual: record?.actual || 0,
          forecast: record?.forecast || 0,
          compareActual: comparison?.actual || 0
        };
      });
    } else {
      return [...allData].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
      }).map(d => ({
        ...d,
        displayDate: `${d.month} ${d.year}`
      }));
    }
  }, [allData, selectedYear, compareYear, viewMode]);

  return (
    <div className={`space-y-8 pb-24 animate-in-fade ${isRefreshing ? 'opacity-80' : ''} transition-opacity`}>
      <AddDataModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddOrUpdateData} 
        defaultYear={selectedYear}
      />

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp size={16} className="text-orange-600" />
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Predictive Intelligence</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Demand <span className="text-orange-500">Forecasting</span></h2>
          <p className="text-slate-500 font-bold text-sm mt-0.5 max-w-xl leading-relaxed">
            Monitor patterns, analyze deviations, and forecast future volume throughput.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
             <button
               onClick={() => setViewMode('yearly')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                 viewMode === 'yearly' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               <Layers size={14} /> Yearly
             </button>
             <button
               onClick={() => setViewMode('timeline')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                 viewMode === 'timeline' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               <History size={14} /> Timeline
             </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-orange-200 text-slate-900 rounded-xl hover:bg-orange-50 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
          >
            <Plus size={16} strokeWidth={3} className="text-orange-500" />
            Log Entry
          </button>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)] overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Fiscal Year</label>
              <div className="relative inline-block">
                <select 
                  className="appearance-none bg-[#fffcf9] border border-orange-200 rounded-lg px-4 py-2 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {availableYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
              </div>
            </div>

            {viewMode === 'yearly' && (
              <div className="relative">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Comparison</label>
                <div className="relative inline-block">
                  <select 
                    className="appearance-none bg-[#fffcf9] border border-slate-200 rounded-lg px-4 py-2 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-slate-500/10 transition-all cursor-pointer"
                    value={compareYear || ""}
                    onChange={(e) => setCompareYear(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">No Overlay</option>
                    {availableYears.filter(y => y !== selectedYear).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-5 bg-[#fffcf9] px-4 py-2.5 rounded-xl border border-orange-50">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 bg-orange-600 rounded-full"></span> Actuals
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 bg-slate-300 border border-slate-400 rounded-full border-dashed"></span> AI Target
            </div>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="compareGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fee2e2" />
              <XAxis 
                dataKey={viewMode === 'timeline' ? "displayDate" : "month"} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} 
                dy={12} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} 
                dx={-10} 
              />
              <Tooltip 
                cursor={{ stroke: '#fdba74', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 40px rgba(249,115,22,0.1)', 
                  padding: '16px'
                }}
              />
              
              {compareYear && (
                <Area 
                  type="monotone" 
                  dataKey="compareActual" 
                  name={`Actual ${compareYear}`} 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  fill="url(#compareGrad)" 
                />
              )}
              
              <Area 
                type="monotone" 
                dataKey="actual" 
                name={`Actual ${selectedYear}`} 
                stroke="#f97316" 
                strokeWidth={4}
                fill="url(#actualGrad)" 
                animationDuration={1500} 
              />
              
              <Line 
                type="monotone" 
                dataKey="forecast" 
                name="AI Prediction" 
                stroke="#cbd5e1" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ForecastingView;
