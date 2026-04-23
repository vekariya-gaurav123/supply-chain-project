
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, X, Warehouse as WhIcon, Sparkles, AlertCircle, Bell } from 'lucide-react';
import { Warehouse, User } from '../types';
import { mockApi } from '../services/mockApi';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wh: Omit<Warehouse, 'id'>) => void;
  initialData?: Warehouse;
}

export const WarehouseModal: React.FC<WarehouseModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Warehouse, 'id'>>({
    name: '', region: '', capacity: 10000, currentStock: 0, operatingCost: 20000, status: 'active', x: 50, y: 50,
    lowStockThreshold: 1000, overstockThreshold: 9000
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        ...initialData,
        lowStockThreshold: initialData.lowStockThreshold || Math.round(initialData.capacity * 0.1),
        overstockThreshold: initialData.overstockThreshold || Math.round(initialData.capacity * 0.9)
      });
    } else {
      setFormData({ 
        name: '', region: '', capacity: 10000, currentStock: 0, operatingCost: 20000, status: 'active', x: 50, y: 50,
        lowStockThreshold: 1000, overstockThreshold: 9000
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateAndSubmit = () => {
    if (formData.currentStock > formData.capacity) {
      setError(`Stock (${formData.currentStock}) cannot exceed capacity (${formData.capacity})`);
      return;
    }
    setError(null);
    onSubmit(formData);
  };

  const handleFieldChange = (field: keyof Omit<Warehouse, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in-fade p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative border border-orange-50 max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-8 top-8 text-slate-300 hover:text-orange-500 transition-colors">
          <X size={28} />
        </button>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3.5 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-200">
            <WhIcon size={24} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{initialData ? 'Edit Warehouse' : 'Add New Warehouse'}</h3>
        </div>
        
        <div className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold animate-in-fade">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Warehouse Name</label>
            <input 
              type="text" 
              className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold"
              value={formData.name}
              onChange={e => handleFieldChange('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold"
                value={formData.region}
                onChange={e => handleFieldChange('region', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operational Status</label>
              <select 
                className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-semibold cursor-pointer"
                value={formData.status}
                onChange={e => handleFieldChange('status', e.target.value)}
              >
                <option value="active">Open / Active</option>
                <option value="shutdown">Closed / Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Capacity</label>
              <input 
                type="number" 
                className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-bold"
                value={formData.capacity}
                onChange={e => handleFieldChange('capacity', parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Stock</label>
              <input 
                type="number" 
                className="w-full px-5 py-4 bg-[#fffcf9] border border-orange-100 rounded-2xl font-bold"
                value={formData.currentStock}
                onChange={e => handleFieldChange('currentStock', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-xs tracking-widest">Cancel</button>
          <button onClick={validateAndSubmit} className="flex-[2] py-4 text-white orange-gradient rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-orange-200 active:scale-95 transition-all">
            {initialData ? 'Save Changes' : 'Create Warehouse'}
          </button>
        </div>
      </div>
    </div>
  );
};

const WarehouseNetworkView: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<Warehouse | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const refresh = () => mockApi.getWarehouses().then(setWarehouses);

  useEffect(() => { 
    refresh(); 
    setUser(mockApi.getCurrentUser());
    
    // Auto-sync listener
    window.addEventListener('db-sync', refresh);
    return () => window.removeEventListener('db-sync', refresh);
  }, []);

  const isAdmin = user?.role === 'admin';

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this warehouse?')) {
      await mockApi.deleteWarehouse(id);
      refresh();
    }
  };

  const handleEditClick = (wh: Warehouse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWh(wh);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: Omit<Warehouse, 'id'>) => {
    if (editingWh) await mockApi.updateWarehouse(editingWh.id, data);
    else await mockApi.addWarehouse(data);
    setIsModalOpen(false);
    setEditingWh(undefined);
    refresh();
  };

  const filteredWarehouses = warehouses.filter(wh => 
    wh.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    wh.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in-fade">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <WhIcon size={16} className="text-orange-500" />
            <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Global Network</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory <span className="text-orange-500">Nodes</span></h2>
          <p className="text-slate-400 font-medium mt-1">
            {isAdmin ? 'Add or modify warehouse records across the cluster.' : 'Real-time overview of storage node status and utilization.'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setEditingWh(undefined); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Add Warehouse
          </button>
        )}
      </div>

      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors">
          <Search size={24} />
        </div>
        <input 
          type="text" 
          placeholder="Filter by facility name or location..." 
          className="w-full pl-16 pr-8 py-5 bg-white border border-orange-50 rounded-[2rem] outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 transition-all shadow-sm font-semibold"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-[0_8px_30px_rgb(251,146,60,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fffcf9] border-b border-orange-50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name & Location</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Storage Used</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">OPEX</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50/50">
              {filteredWarehouses.map(wh => (
                <tr 
                  key={wh.id} 
                  className="hover:bg-orange-50/20 transition-all group cursor-pointer"
                  onClick={() => navigate(`/network/${wh.id}`)}
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="p-3.5 rounded-2xl bg-orange-50 text-orange-500 shadow-sm">
                        <WhIcon size={24} />
                      </div>
                      <div>
                        <div className="font-black text-slate-900 tracking-tight text-lg">{wh.name}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{wh.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="max-w-[200px]">
                      <div className="flex justify-between text-[11px] mb-2.5 font-black uppercase tracking-tighter">
                        <span className="text-slate-500">{Math.round((wh.currentStock / wh.capacity) * 100)}% Full</span>
                        <span className="text-slate-300">{(wh.currentStock / 1000).toFixed(1)}k u</span>
                      </div>
                      <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100/50">
                        <div 
                          className="h-full rounded-full orange-gradient transition-all duration-1000" 
                          style={{ width: `${Math.min((wh.currentStock / wh.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${
                      wh.status === 'active' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {wh.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 text-lg tracking-tighter">${wh.operatingCost.toLocaleString()}</div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {isAdmin && (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={(e) => handleEditClick(wh, e)}
                          className="p-3 bg-white border border-orange-100 rounded-xl text-slate-400 hover:text-orange-500 hover:border-orange-500 transition-all shadow-sm"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(wh.id, e)}
                          className="p-3 bg-white border border-orange-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WarehouseModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingWh(undefined); }} 
        onSubmit={handleModalSubmit}
        initialData={editingWh}
      />
    </div>
  );
};

export default WarehouseNetworkView;
