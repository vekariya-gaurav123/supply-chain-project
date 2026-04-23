
import React, { useState } from 'react';
import { Play, RotateCcw, Info, Zap, Activity, Clock, DollarSign, Target } from 'lucide-react';
import { SimulationResult } from '../types';
import { mockApi } from '../services/mockApi';

const SimulationView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const toggleScenario = (id: string) => {
    setActiveScenarios(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const runSim = async () => {
    if (activeScenarios.length === 0) return;
    setIsRunning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2000));
    const impacts = activeScenarios.map(s => ({ type: s, intensity: 1.0 }));
    const simRes = await mockApi.runSimulation(impacts);
    setResult(simRes);
    setIsRunning(false);
  };

  const scenarios = [
    { id: 'shutdown', title: 'Port Shutdown', desc: 'A major warehouse goes offline', icon: <Zap className="text-orange-600" /> },
    { id: 'delay', title: 'Shipping Delay', desc: 'Trucks or ships are stuck in traffic', icon: <Clock className="text-orange-600" /> },
    { id: 'spike', title: 'Huge Sale', desc: 'Everyone wants to buy at the same time', icon: <Activity className="text-orange-600" /> },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in-fade">
      {/* Configuration Panel */}
      <div className="xl:col-span-4 space-y-8">
        <div className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Scenario Tester</h3>
          <p className="text-sm text-slate-600 font-bold mb-8">Pick an event below to see how it affects your business.</p>
          
          <div className="space-y-4">
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => toggleScenario(sc.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-5 ${
                  activeScenarios.includes(sc.id) 
                  ? 'border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100/50' 
                  : 'border-orange-100 hover:border-orange-300 bg-[#fffcf9]'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${activeScenarios.includes(sc.id) ? 'bg-orange-500 text-white' : 'bg-orange-50'}`}>
                  {sc.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{sc.title}</h4>
                  <p className="text-xs text-slate-700 font-bold mt-1 leading-relaxed">{sc.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-orange-100">
            <button 
              onClick={runSim}
              disabled={isRunning || activeScenarios.length === 0}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${
                activeScenarios.length === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'orange-gradient text-white hover:scale-[1.02] shadow-orange-200'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" />
                  Run Test
                </>
              )}
            </button>
            <button 
              onClick={() => {setActiveScenarios([]); setResult(null);}}
              className="w-full mt-4 py-2 text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw size={14} />
              Reset Choices
            </button>
          </div>
        </div>

        <div className="orange-soft-gradient p-8 rounded-[2rem] border border-orange-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
            <Target size={120} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-orange-500 rounded-lg text-white">
                <Info size={16} />
              </div>
              <span className="text-xs font-black text-orange-900 uppercase tracking-widest">Help</span>
            </div>
            <p className="text-sm text-orange-900 leading-relaxed font-bold">
              We use smart math to predict how costs and delivery times change when these things happen.
            </p>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <div className="xl:col-span-8">
        {!result && !isRunning ? (
          <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-orange-200 rounded-[2.5rem] bg-orange-50/20">
            <div className="p-8 bg-white rounded-full text-orange-300 shadow-xl shadow-orange-100/20 mb-6">
              <Zap size={48} className="fill-orange-50" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Waiting for Choices</h3>
            <p className="text-slate-600 mt-2 max-w-sm text-center font-bold">
              Pick an event on the left and click "Run Test" to see results.
            </p>
          </div>
        ) : isRunning ? (
          <div className="h-full min-h-[600px] flex flex-col items-center justify-center border border-orange-100 rounded-[2.5rem] bg-white animate-pulse">
            <div className="text-center">
              <div className="inline-block p-6 rounded-[2rem] bg-orange-50 text-orange-500 mb-8">
                <Activity size={56} className="animate-bounce" />
              </div>
              <h3 className="text-3xl font-black text-slate-900">Calculating...</h3>
              <p className="text-slate-600 mt-3 font-bold">Checking thousands of possibilities.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in-fade">
            <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_15px_50px_rgba(249,115,22,0.08)]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900">Test Result</h3>
                  <p className="text-slate-600 font-bold mt-1 italic">Based on your choices</p>
                </div>
                <div className={`px-6 py-2 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-100 ${result?.serviceLevel < 90 ? 'bg-orange-600' : 'bg-emerald-600'}`}>
                  {result?.serviceLevel < 90 ? 'High Impact' : 'Low Impact'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-700 text-xs font-black uppercase tracking-widest mb-3">
                    <DollarSign size={14} /> Total Cost
                  </div>
                  <div className="text-3xl font-black text-slate-900">${result?.totalCost.toLocaleString()}</div>
                </div>
                <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-700 text-xs font-black uppercase tracking-widest mb-3">
                    <Clock size={14} /> Delay
                  </div>
                  <div className="text-3xl font-black text-slate-900">+{result?.averageLeadTime.toFixed(1)} Days</div>
                </div>
                <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100">
                  <div className="flex items-center gap-2 text-orange-700 text-xs font-black uppercase tracking-widest mb-3">
                    <Activity size={14} /> On-Time Rate
                  </div>
                  <div className="text-3xl font-black text-slate-900">{result?.serviceLevel.toFixed(1)}%</div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-black text-slate-900">Risk Details</h4>
                <div className="space-y-5">
                  {Object.entries(result?.metrics || {}).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-2 capitalize">
                        <span className="text-slate-700 font-bold uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-black text-slate-900">{Math.round(val as number)}% Risk</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full orange-gradient rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(val as number, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h4 className="text-lg font-black text-slate-900 mb-2">Our Suggestion</h4>
                <p className="text-sm text-slate-700 font-bold">We found a way to save money by changing your shipping routes.</p>
              </div>
              <button className="whitespace-nowrap px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">
                Apply Fix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationView;
