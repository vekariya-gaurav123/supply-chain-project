
import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Zap,
  Plane,
  Ship,
  TrainFront,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart2,
  Plus,
  Edit2,
  Trash2,
  X,
  MapPin,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { ShippingRoute, Warehouse, TransportMode, User, RouteStatus } from '../types';
import { mockApi } from '../services/mockApi';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (route: Omit<ShippingRoute, 'id'>) => void;
  initialData?: ShippingRoute;
  warehouses: Warehouse[];
}

const RouteModal: React.FC<RouteModalProps> = ({ isOpen, onClose, onSubmit, initialData, warehouses }) => {
  const [formData, setFormData] = useState<Omit<ShippingRoute, 'id' | 'timestamp'>>({
    originId: '', 
    destinationId: '', 
    costPerUnit: 1.0, 
    leadTimeDays: 1, 
    distanceKm: 100, 
    status: 'on way', 
    mode: 'Road', 
    activeVolume: 0, 
    utilization: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        originId: initialData.originId,
        destinationId: initialData.destinationId,
        costPerUnit: initialData.costPerUnit,
        leadTimeDays: initialData.leadTimeDays,
        distanceKm: initialData.distanceKm,
        status: initialData.status,
        mode: initialData.mode,
        activeVolume: initialData.activeVolume,
        utilization: initialData.utilization
      });
    } else {
      setFormData({
        originId: warehouses[0]?.name || '',
        destinationId: warehouses[1]?.name || warehouses[0]?.name || '',
        costPerUnit: 1.0, 
        leadTimeDays: 1, 
        distanceKm: 100, 
        status: 'on way', 
        mode: 'Road', 
        activeVolume: 0, 
        utilization: 0
      });
    }
  }, [initialData, isOpen, warehouses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in-fade">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 relative border border-orange-50 max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-8 top-8 text-slate-300 hover:text-orange-500 transition-colors">
          <X size={28} />
        </button>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-lg">
            <Truck size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{initialData ? 'Edit Logistics Lane' : 'Establish New Route'}</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin Hub</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-slate-900 appearance-none cursor-pointer"
                  value={formData.originId}
                  onChange={e => setFormData({ ...formData, originId: e.target.value })}
                >
                  <option value="" disabled>Select Origin</option>
                  {warehouses.map(wh => (
                    <option key={wh.id} value={wh.name}>{wh.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination Hub</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-slate-900 appearance-none cursor-pointer"
                  value={formData.destinationId}
                  onChange={e => setFormData({ ...formData, destinationId: e.target.value })}
                >
                  <option value="" disabled>Select Destination</option>
                  {warehouses.map(wh => (
                    <option key={wh.id} value={wh.name}>{wh.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transit Mode</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all cursor-pointer appearance-none"
                  value={formData.mode}
                  onChange={e => setFormData({ ...formData, mode: e.target.value as TransportMode })}
                >
                  <option value="Road">Road (Trucking)</option>
                  <option value="Rail">Rail (Intermodal)</option>
                  <option value="Air">Air (Express)</option>
                  <option value="Sea">Sea (Ocean Cargo)</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</label>
              <div className="relative">
                <select 
                  className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all cursor-pointer appearance-none"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as RouteStatus })}
                >
                  <option value="on way">On Way</option>
                  <option value="arrived">Arrived</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost/Unit</label>
              <input 
                type="number" step="0.1"
                className="w-full px-4 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-black text-slate-900"
                value={formData.costPerUnit}
                onChange={e => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Time (D)</label>
              <input 
                type="number"
                className="w-full px-4 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-black text-slate-900"
                value={formData.leadTimeDays}
                onChange={e => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Units</label>
              <input 
                type="number"
                className="w-full px-4 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-black text-slate-900"
                value={formData.activeVolume}
                onChange={e => setFormData({ ...formData, activeVolume: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest">Cancel</button>
          <button 
            onClick={() => onSubmit({ ...formData, timestamp: initialData?.timestamp || new Date().toISOString() } as Omit<ShippingRoute, 'id'>)}
            className="flex-[2] py-4 text-white bg-slate-900 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            {initialData ? 'Update Corridor' : 'Establish Route'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string | number, subtext: string, icon: React.ReactNode, trend?: string }> = ({ title, value, subtext, icon, trend }) => (
  <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.04)] hover-float cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
        {icon}
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <h4 className="text-2xl font-black text-slate-900 mt-1">{value}</h4>
    <p className="text-[10px] font-bold text-slate-500 mt-1">{subtext}</p>
  </div>
);

const ModeIcon: React.FC<{ mode: TransportMode }> = ({ mode }) => {
  switch (mode) {
    case 'Air': return <Plane size={20} />;
    case 'Sea': return <Ship size={20} />;
    case 'Rail': return <TrainFront size={20} />;
    default: return <Truck size={20} />;
  }
};

const RouteOptimizationView: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<ShippingRoute[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<ShippingRoute | undefined>();

  const loadData = async () => {
    const [r, w] = await Promise.all([
      mockApi.getRoutes(),
      mockApi.getWarehouses()
    ]);
    setRoutes(r);
    setWarehouses(w);
  };

  useEffect(() => {
    loadData();
    setUser(mockApi.getCurrentUser());
  }, []);

  const isAdmin = user?.role === 'admin';

  const handleRecalculate = async () => {
    if (!isAdmin) return;
    setIsRecalculating(true);
    await new Promise(r => setTimeout(r, 2000));
    const updatedRoutes = routes.map(route => ({
      ...route,
      costPerUnit: route.costPerUnit * 0.98,
      leadTimeDays: Math.max(1, route.leadTimeDays - 0.5)
    }));
    for (const r of updatedRoutes) {
      await mockApi.updateRoute(r.id, r);
    }
    await loadData();
    setIsRecalculating(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Permanently decommission this logistics lane?')) {
      await mockApi.deleteRoute(id);
      loadData();
    }
  };

  const handleModalSubmit = async (data: Omit<ShippingRoute, 'id'>) => {
    if (editingRoute) await mockApi.updateRoute(editingRoute.id, data);
    else await mockApi.addRoute(data);
    setIsModalOpen(false);
    setEditingRoute(undefined);
    loadData();
  };

  const avgCost = routes.reduce((acc, curr) => acc + curr.costPerUnit, 0) / (routes.length || 1);
  const avgLeadTime = routes.reduce((acc, curr) => acc + curr.leadTimeDays, 0) / (routes.length || 1);

  const getStatusColor = (status: RouteStatus) => {
    switch (status) {
      case 'on way': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'arrived': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'delayed': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'cancelled': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  const formatDateTime = (isoString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(isoString));
  };

  return (
    <div className="space-y-12 animate-in-fade pb-24">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
              <Navigation size={14} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Transit Intelligence</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Logistics <span className="text-orange-500">Manifest</span></h2>
          <p className="text-slate-500 font-bold mt-2 max-w-xl">
            {isAdmin ? 'Manage logistics lanes, update delivery status, and track order timestamps.' : 'Real-time monitoring of global transit channels and fleet health.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {isAdmin && (
            <>
              <button 
                onClick={() => { setEditingRoute(undefined); setIsModalOpen(true); }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:border-orange-500 hover:text-orange-600 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
              >
                <Plus size={20} strokeWidth={3} />
                Establish Route
              </button>
              <button 
                onClick={handleRecalculate}
                disabled={isRecalculating}
                className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 disabled:opacity-50"
              >
                {isRecalculating ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} className="fill-white" />}
                {isRecalculating ? 'Optimizing...' : 'Smart Recalculate'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <StatCard title="Transit Items" value={routes.reduce((a, b) => a + b.activeVolume, 0).toLocaleString()} subtext="Moving through network" icon={<BarChart2 size={24} />} trend="+12.5%" />
        <StatCard title="Arrival Avg" value={`${avgLeadTime.toFixed(1)} Days`} subtext="Lead time across lanes" icon={<Clock size={24} />} />
        <StatCard title="Corridor Cost" value={`$${avgCost.toFixed(2)}`} subtext="Avg cost per item" icon={<DollarSign size={24} />} trend="-4.2%" />
        <StatCard title="Active Fleet" value={routes.length} subtext="Global transport links" icon={<Truck size={24} />} />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-[0_8px_30px_rgb(251,146,60,0.04)] overflow-hidden">
        <div className="p-8 border-b border-orange-50 bg-[#fffcf9] flex justify-between items-center">
           <h3 className="text-xl font-black text-slate-900 tracking-tight">Supply Corridors</h3>
           <div className="px-4 py-1.5 bg-white border border-orange-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
             <Calendar size={12} /> Ordered by Creation
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-orange-50">
                <th className="px-10 py-5">Origin → Destination</th>
                <th className="px-10 py-5">Mode</th>
                <th className="px-10 py-5">Units</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5">Date & Time</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50">
              {[...routes].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(route => (
                <tr key={route.id} className="hover:bg-orange-50/20 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                         <MapPin size={14} />
                      </div>
                      <span className="font-bold text-slate-900 whitespace-nowrap">{route.originId}</span>
                      <ArrowRight size={14} className="text-slate-300 flex-shrink-0" />
                      <span className="font-bold text-slate-900 whitespace-nowrap">{route.destinationId}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                       <ModeIcon mode={route.mode} />
                       <span className="text-xs font-bold text-slate-600 uppercase">{route.mode}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-slate-700">{route.activeVolume.toLocaleString()}</td>
                  <td className="px-10 py-6">
                    <span className={`inline-block text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${getStatusColor(route.status)}`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                        {formatDateTime(route.timestamp).split(',')[0]}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {formatDateTime(route.timestamp).split(',')[1]}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {isAdmin ? (
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => { setEditingRoute(route); setIsModalOpen(true); }}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(route.id)}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button className="text-[9px] font-black uppercase text-slate-300 tracking-widest cursor-default">Read Only</button>
                    )}
                  </td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    No active routes in database. Use "Establish Route" to add data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RouteModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingRoute(undefined); }} 
        onSubmit={handleModalSubmit}
        initialData={editingRoute}
        warehouses={warehouses}
      />
    </div>
  );
};

export default RouteOptimizationView;
