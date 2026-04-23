
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Warehouse as WhIcon, 
  Edit2, 
  DollarSign, 
  Package, 
  ShieldCheck, 
  Activity,
  AlertCircle,
  Bell,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Warehouse } from '../types';
import { mockApi } from '../services/mockApi';
import { WarehouseModal } from './WarehouseNetworkView';

const DetailCard: React.FC<{ 
  title: string; 
  value: string | number; 
  subValue?: string; 
  icon: React.ReactNode; 
}> = ({ title, value, subValue, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)] flex flex-col items-start">
    <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 mb-4">
      {icon}
    </div>
    <p className="text-slate-600 text-xs font-black uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
    {subValue && <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">{subValue}</p>}
  </div>
);

const WarehouseDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWarehouse = async () => {
    if (!id) return;
    setLoading(true);
    const data = await mockApi.getWarehouseById(id);
    setWarehouse(data || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchWarehouse();
  }, [id]);

  const handleModalSubmit = async (data: Omit<Warehouse, 'id'>) => {
    if (warehouse) {
      const updated = await mockApi.updateWarehouse(warehouse.id, data);
      setWarehouse(updated || null);
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Locating Warehouse...</p>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-6">
        <div className="p-6 bg-rose-50 text-rose-500 rounded-full">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Warehouse Not Found</h3>
        <button 
          onClick={() => navigate('/network')}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
        >
          Return to Network
        </button>
      </div>
    );
  }

  const stockPercentage = Math.round((warehouse.currentStock / warehouse.capacity) * 100);
  const isLowStock = warehouse.lowStockThreshold ? warehouse.currentStock <= warehouse.lowStockThreshold : false;
  const isOverstock = warehouse.overstockThreshold ? warehouse.currentStock >= warehouse.overstockThreshold : false;
  const isCapacityBreached = warehouse.currentStock > warehouse.capacity;

  const lowStockPct = warehouse.lowStockThreshold ? (warehouse.lowStockThreshold / warehouse.capacity) * 100 : 10;
  const overstockPct = warehouse.overstockThreshold ? (warehouse.overstockThreshold / warehouse.capacity) * 100 : 90;

  return (
    <div className="space-y-8 animate-in-fade pb-20">
      {/* Alert Banners */}
      {(isLowStock || isOverstock || isCapacityBreached) && (
        <div className="space-y-3">
          {isCapacityBreached && (
            <div className="bg-rose-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-rose-200 animate-bounce">
              <div className="flex items-center gap-4">
                <AlertCircle size={24} />
                <div>
                  <p className="font-black text-sm uppercase tracking-widest">Critical Alert: Capacity Breached</p>
                  <p className="text-xs opacity-90 font-bold">Current stock exceeds total warehouse capacity!</p>
                </div>
              </div>
            </div>
          )}
          {isLowStock && !isCapacityBreached && (
            <div className="bg-amber-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-amber-100">
              <div className="flex items-center gap-4">
                <Bell size={24} />
                <div>
                  <p className="font-black text-sm uppercase tracking-widest">Inventory Alert: Low Stock</p>
                  <p className="text-xs opacity-90 font-bold">Stock level has dropped below the threshold of {warehouse.lowStockThreshold?.toLocaleString()} units.</p>
                </div>
              </div>
            </div>
          )}
          {isOverstock && !isCapacityBreached && (
            <div className="bg-orange-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-orange-100">
              <div className="flex items-center gap-4">
                <AlertCircle size={24} />
                <div>
                  <p className="font-black text-sm uppercase tracking-widest">Inventory Alert: Overstock</p>
                  <p className="text-xs opacity-90 font-bold">Stock level is exceeding the overstock limit of {warehouse.overstockThreshold?.toLocaleString()} units.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/network')}
          className="flex items-center gap-2 text-slate-600 hover:text-orange-600 font-bold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Network
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
        >
          <Edit2 size={18} strokeWidth={2.5} />
          Modify Warehouse
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-10">
          {/* Main Info Header */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <WhIcon size={160} />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
                <div className="p-6 bg-orange-500 text-white rounded-[2rem] shadow-xl shadow-orange-200">
                  <WhIcon size={48} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{warehouse.name}</h2>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      warehouse.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {warehouse.status === 'active' ? 'Operational' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">{warehouse.region} Logistics Gateway</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DetailCard title="Current Stock" value={warehouse.currentStock.toLocaleString()} subValue="Units on hand" icon={<Package size={20} />} />
                <DetailCard title="Total Capacity" value={warehouse.capacity.toLocaleString()} subValue="Max volume" icon={<Activity size={20} />} />
                <DetailCard title="Operating Cost" value={`$${warehouse.operatingCost.toLocaleString()}`} subValue="Monthly OPEX" icon={<DollarSign size={20} />} />
                <DetailCard title="Risk Rating" value={isLowStock || isOverstock ? 'Elevated' : 'Optimal'} subValue="Safety Analysis" icon={<ShieldCheck size={20} />} />
             </div>
          </div>

          {/* Visualization Section */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Inventory Utilization</h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Healthy Range
                  </span>
                </div>
             </div>
             
             <div className="space-y-12">
                <div className="relative pt-6">
                   {/* Threshold Markers */}
                   <div 
                     className="absolute -top-1 h-3 w-1 bg-emerald-500 rounded-full z-10" 
                     style={{ left: `${lowStockPct}%` }}
                     title={`Low Stock Threshold: ${warehouse.lowStockThreshold}`}
                   >
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-600 whitespace-nowrap uppercase tracking-tighter">Low Limit</span>
                   </div>
                   <div 
                     className="absolute -top-1 h-3 w-1 bg-orange-600 rounded-full z-10" 
                     style={{ left: `${overstockPct}%` }}
                     title={`Overstock Threshold: ${warehouse.overstockThreshold}`}
                   >
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-orange-600 whitespace-nowrap uppercase tracking-tighter">High Limit</span>
                   </div>

                   <div className="h-8 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative group">
                      <div 
                        className={`h-full rounded-2xl transition-all duration-1000 shadow-inner ${
                          isCapacityBreached ? 'bg-rose-600 animate-pulse' : 
                          isOverstock ? 'bg-orange-600' : 
                          isLowStock ? 'bg-amber-400' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      ></div>
                      
                      {/* Scale Indicators */}
                      <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
                        {[0, 25, 50, 75, 100].map(m => (
                          <div key={m} className="h-full w-px bg-slate-900"></div>
                        ))}
                      </div>
                   </div>
                   <div className="flex justify-between mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <span>0 Units</span>
                      <span>50%</span>
                      <span>{warehouse.capacity.toLocaleString()} Units</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-[#fffcf9] p-6 rounded-[2rem] border border-orange-50 flex items-center justify-between group hover:border-orange-500 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm group-hover:text-orange-500 transition-colors">
                          <Bell size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alert Profile</p>
                           <p className="text-sm font-black text-slate-900">Adaptive Dynamic Thresholds</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-all" />
                   </div>
                   <div className="bg-[#fffcf9] p-6 rounded-[2rem] border border-orange-50 flex items-center justify-between group hover:border-orange-500 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl text-slate-400 shadow-sm group-hover:text-orange-500 transition-colors">
                          <Activity size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Rate</p>
                           <p className="text-sm font-black text-slate-900">+4.2% Week over Week</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-all" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
           {/* Alert Config Card */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.06)]">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                    <Bell size={20} />
                 </div>
                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Alert Config</h4>
              </div>
              
              <div className="space-y-6">
                 <div className={`p-5 rounded-2xl border transition-all ${isLowStock ? 'bg-amber-50 border-amber-200' : 'bg-[#fffcf9] border-orange-50'}`}>
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Low Stock Min</span>
                       {isLowStock && <span className="bg-amber-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase">Triggered</span>}
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="text-2xl font-black text-slate-900">{warehouse.lowStockThreshold?.toLocaleString()}</span>
                       <span className="text-[10px] font-bold text-slate-400">Units</span>
                    </div>
                 </div>

                 <div className={`p-5 rounded-2xl border transition-all ${isOverstock ? 'bg-orange-50 border-orange-200' : 'bg-[#fffcf9] border-orange-50'}`}>
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Overstock Max</span>
                       {isOverstock && <span className="bg-orange-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase">Triggered</span>}
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="text-2xl font-black text-slate-900">{warehouse.overstockThreshold?.toLocaleString()}</span>
                       <span className="text-[10px] font-bold text-slate-400">Units</span>
                    </div>
                 </div>

                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="w-full py-4 bg-orange-50 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-100 transition-all border border-orange-100 border-dashed"
                 >
                   Adjust Thresholds
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-6 -right-6 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={160} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="p-3 bg-white/10 rounded-2xl w-fit mb-6">
                  <ShieldCheck size={32} className="text-orange-500" />
                </div>
                <h4 className="text-2xl font-black tracking-tight mb-4">System Recommendations</h4>
                <p className="text-sm font-medium opacity-80 leading-relaxed mb-10">
                  {isLowStock ? 
                    'Immediate restock required. Midwest Hub has surplus capacity available for transfer.' :
                    isOverstock ?
                    'Transfer inventory to South Logistics to prevent aging and holding cost spikes.' :
                    'Inventory levels are stable. Maintain current procurement cycles.'
                  }
                </p>
                <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-900/40 hover:bg-orange-500 transition-all active:scale-95">
                  Optimize Now
                </button>
              </div>
           </div>
        </div>
      </div>

      <WarehouseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        initialData={warehouse}
      />
    </div>
  );
};

export default WarehouseDetailView;
