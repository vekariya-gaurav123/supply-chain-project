const API_BASE = 'http://localhost:5000/api';

// Types matching the backend
interface Warehouse {
  id?: string;
  _id?: string;
  name: string;
  region: string;
  capacity: number;
  currentStock: number;
  operatingCost: number;
  status: string;
  x?: number;
  y?: number;
}

interface ShippingRoute {
  id?: string;
  _id?: string;
  originId: string;
  destinationId: string;
  costPerUnit: number;
  leadTimeDays: number;
  distanceKm: number;
  status: string;
  mode: string;
  activeVolume: number;
  utilization: number;
  timestamp?: string;
}

interface DemandData {
  _id?: string;
  year: number;
  month: string;
  actual: number;
  forecast: number;
}

// Convert MongoDB _id to frontend id
const convertWarehouse = (w: any): Warehouse => ({
  id: w._id || w.id,
  name: w.name,
  region: w.region,
  capacity: w.capacity,
  currentStock: w.currentStock,
  operatingCost: w.operatingCost,
  status: w.status,
  x: w.x,
  y: w.y
});

const convertRoute = (r: any): ShippingRoute => ({
  id: r._id || r.id,
  originId: r.originId?.name || r.originId || r.originId,
  destinationId: r.destinationId?.name || r.destinationId || r.destinationId,
  costPerUnit: r.costPerUnit,
  leadTimeDays: r.leadTimeDays,
  distanceKm: r.distanceKm,
  status: r.status,
  mode: r.mode,
  activeVolume: r.activeVolume,
  utilization: r.utilization,
  timestamp: r.timestamp || new Date().toISOString()
});

export const api = {
  // --- WAREHOUSES ---
  getWarehouses: async (): Promise<Warehouse[]> => {
    const res = await fetch(`${API_BASE}/warehouses`);
    const data = await res.json();
    return data.map(convertWarehouse);
  },

  addWarehouse: async (wh: Omit<Warehouse, 'id'>): Promise<Warehouse> => {
    const res = await fetch(`${API_BASE}/warehouses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wh)
    });
    const data = await res.json();
    return convertWarehouse(data);
  },

  updateWarehouse: async (id: string, updates: Partial<Warehouse>): Promise<Warehouse> => {
    const res = await fetch(`${API_BASE}/warehouses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    return convertWarehouse(data);
  },

  deleteWarehouse: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/warehouses/${id}`, { method: 'DELETE' });
  },

  // --- ROUTES ---
  getRoutes: async (): Promise<ShippingRoute[]> => {
    const res = await fetch(`${API_BASE}/routes`);
    const data = await res.json();
    return data.map(convertRoute);
  },

  addRoute: async (route: Omit<ShippingRoute, 'id'>): Promise<ShippingRoute> => {
    const res = await fetch(`${API_BASE}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(route)
    });
    const data = await res.json();
    return convertRoute(data);
  },

  deleteRoute: async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/routes/${id}`, { method: 'DELETE' });
  },

  // --- DEMAND ---
  getDemand: async (): Promise<DemandData[]> => {
    const res = await fetch(`${API_BASE}/demand`);
    return res.json();
  },

  addDemand: async (demand: Omit<DemandData, '_id'>): Promise<DemandData> => {
    const res = await fetch(`${API_BASE}/demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demand)
    });
    return res.json();
  }
};
