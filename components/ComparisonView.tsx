
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, DollarSign, Clock, ShieldCheck, Sparkles, RefreshCw, AlertCircle, ThumbsUp } from 'lucide-react';
import { SimulationResult } from '../types';
import { mockApi } from '../services/mockApi';

const ComparisonView: React.FC = () => {
  const [comparisons, setComparisons] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScenarios = async () => {
    setLoading(true);
    // Fetch three different scenarios to compare
    const scenario1 = await mockApi.runSimulation([]); 
    const scenario2 = await mockApi.runSimulation([{ type: 'spike', intensity: 1.2 }]); 
    // Fix: Removed 'targetId' from the disruption object literal to match the expected type { type: string; intensity: number; }
    const scenario3 = await mockApi.runSimulation([{ type: 'shutdown', intensity: 1.0 }]); 

    setComparisons([
      { ...scenario1, name: 'Normal Business' },
      { ...scenario2, name: 'Holiday Rush' },
      { ...scenario3, name: 'Warehouse Down' }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const costData = comparisons.map(c => ({
    name: c.name,
    value: Math.round(c.totalCost / 1000),
  }));

  const serviceData = comparisons.map(c => ({
    name: c.name,
    value: Math.round(c.serviceLevel),
  }));

  if (loading) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-20 space-y-6 animate-pulse">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-slate-900 font-black text-lg tracking-tight">Loading Comparison...</p>
          <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">Checking different situations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in-fade pb-20">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-orange-600" />
            <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Compare Situations</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Side-by-Side <span className="text-orange-500">View</span></h2>
          <p className="text-slate-700 font-bold mt-1">See how different events change your costs and delivery times.</p>
        </div>
        <button 
          onClick={fetchScenarios}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
        >
          <RefreshCw size={18} strokeWidth={2.5} />
          Refresh Test
        </button>
      </div>

      {/* Simplified Scenario Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {comparisons.map((sc, idx) => (
          <div key={sc.id} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover-float ${idx === 0 ? 'border-orange-500 shadow-xl shadow-orange-100/50' : 'border-orange-100 shadow-sm shadow-orange-100/10'}`}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-black text-slate-900 text-2xl tracking-tight leading-tight">{sc.name}</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Scenario Type</p>
              </div>
              {idx === 0 && (
                <div className="flex flex-col items-end">
                  <span className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-200 mb-1 flex items-center gap-1">
                     <ThumbsUp size={10} fill="white" /> Best Performance
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-[#fffcf9] rounded-2xl border border-orange-100">
                <div className="flex flex-col">
                   <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                     <DollarSign size={12} className="text-orange-600" /> Monthly Cost
                   </span>
                   <span className="font-black text-slate-900 text-xl tracking-tighter">${sc.totalCost.toLocaleString()}</span>
                </div>
                {idx > 0 && <span className="text-[10px] font-black text-rose-600">+ Higher Cost</span>}
              </div>

              <div className="flex items-center justify-between p-5 bg-[#fffcf9] rounded-2xl border border-orange-100">
                <div className="flex flex-col">
                   <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                     <Clock size={12} className="text-orange-600" /> Arrival Time
                   </span>
                   <span className="font-black text-slate-900 text-xl tracking-tighter">{sc.averageLeadTime.toFixed(1)} Days</span>
                </div>
                {idx > 0 && <span className="text-[10px] font-black text-rose-600">+ Slower</span>}
              </div>

              <div className="flex items-center justify-between p-5 bg-[#fffcf9] rounded-2xl border border-orange-100">
                <div className="flex flex-col">
                   <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                     <ShieldCheck size={12} className="text-orange-600" /> On-Time Rate
                   </span>
                   <span className={`font-black text-xl tracking-tighter ${sc.serviceLevel < 90 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {sc.serviceLevel.toFixed(1)}%
                   </span>
                </div>
                {sc.serviceLevel < 95 && <span className="text-[10px] font-black text-rose-600">Risk Detected</span>}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-orange-100">
              <p className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-widest">Active Problems</p>
              <div className="flex flex-wrap gap-2">
                {sc.disruptions.length === 0 ? (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <ThumbsUp size={14} /> Everything is fine
                  </span>
                ) : (
                  sc.disruptions.map((d, i) => (
                    <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-black border border-rose-200 uppercase tracking-tighter flex items-center gap-1">
                      <AlertCircle size={10} /> {d.split(' ')[0]} {d.split(' ')[1]}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Total Monthly Cost</h3>
            <p className="text-sm text-slate-600 font-bold">Lower cost is better.</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fee2e2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} unit="k" />
                <Tooltip cursor={{fill: '#fffcf9'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" name="Cost ($1k)" radius={[10, 10, 0, 0]} barSize={40}>
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">On-Time Orders (%)</h3>
            <p className="text-sm text-slate-600 font-bold">Higher percentage is better.</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fee2e2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 800}} unit="%" domain={[0, 100]} />
                <Tooltip cursor={{fill: '#fffcf9'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" name="On-Time Rate" radius={[10, 10, 0, 0]} barSize={40}>
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value < 90 ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="orange-soft-gradient border border-orange-200 p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center shadow-sm">
        <div className="p-4 bg-orange-500 text-white rounded-3xl shadow-xl shadow-orange-100">
          <Sparkles size={32} fill="white" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black text-orange-900 tracking-tight mb-1">Expert Summary</h4>
          <p className="text-sm text-slate-800 leading-relaxed font-bold">
            Compared to normal business, a <span className="text-rose-600 underline">Warehouse Down</span> situation increases your costs the most. We suggest keeping more stock in other locations to prevent customers from waiting too long.
          </p>
        </div>
        <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          Save This Report
        </button>
      </div>
    </div>
  );
};

export default ComparisonView;
