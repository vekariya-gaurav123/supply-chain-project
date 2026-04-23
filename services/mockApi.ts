import { Warehouse, ShippingRoute, SimulationResult, DemandData, User } from '../types';

const API_BASE = 'http://localhost:5000/api';

// Convert MongoDB _id to frontend id format
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

const convertDemand = (d: any): DemandData => ({
  year: d.year,
  month: d.month,
  actual: d.actual,
  forecast: d.forecast
});

// Default data for initial load before API connects
const DEFAULT_WAREHOUSES: Warehouse[] = [
  { id: 'wh-1', name: 'West Coast Hub', region: 'California', capacity: 10000, currentStock: 7200, operatingCost: 25000, status: 'active', x: 15, y: 40, lowStockThreshold: 2000, overstockThreshold: 9000 },
  { id: 'wh-2', name: 'Midwest Distribution', region: 'Illinois', capacity: 15000, currentStock: 11000, operatingCost: 18000, status: 'active', x: 50, y: 35, lowStockThreshold: 3000, overstockThreshold: 14000 },
  { id: 'wh-3', name: 'East Coast Port', region: 'New Jersey', capacity: 20000, currentStock: 14500, operatingCost: 32000, status: 'active', x: 85, y: 30, lowStockThreshold: 4000, overstockThreshold: 18500 },
  { id: 'wh-4', name: 'Southern Logistics', region: 'Texas', capacity: 12000, currentStock: 12500, operatingCost: 20000, status: 'active', x: 45, y: 75, lowStockThreshold: 2500, overstockThreshold: 11000 },
];

const DEFAULT_ROUTES: ShippingRoute[] = [
  { id: 'r-1', originId: 'West Coast Hub', destinationId: 'Midwest Distribution', costPerUnit: 1.2, leadTimeDays: 3, distanceKm: 2800, status: 'on way', mode: 'Road', activeVolume: 1200, utilization: 85, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'r-2', originId: 'Midwest Distribution', destinationId: 'East Coast Port', costPerUnit: 0.8, leadTimeDays: 2, distanceKm: 1300, status: 'arrived', mode: 'Rail', activeVolume: 3500, utilization: 92, timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'r-4', originId: 'West Coast Hub', destinationId: 'East Coast Port', costPerUnit: 4.5, leadTimeDays: 1, distanceKm: 4200, status: 'on way', mode: 'Air', activeVolume: 450, utilization: 40, timestamp: new Date().toISOString() },
];

const DEFAULT_DEMAND: DemandData[] = [
  { year: 2024, month: 'Jan', actual: 4200, forecast: 4100 },
  { year: 2024, month: 'Feb', actual: 3800, forecast: 4000 },
  { year: 2024, month: 'Mar', actual: 4500, forecast: 4400 },
  { year: 2025, month: 'Jan', actual: 7800, forecast: 8000 },
  { year: 2025, month: 'Feb', actual: 7400, forecast: 7700 },
  { year: 2025, month: 'Mar', actual: 0, forecast: 8200 },
];

// Simulated local storage for auth session
const DB_KEYS = {
  WAREHOUSES: 'ps_warehouses',
  ROUTES: 'ps_routes',
  DEMAND: 'ps_demand',
  USERS: 'ps_users',
  SESSION: 'ps_session',
};

const LocalDB = {
  get: <T>(key: string, fallback: T): T => {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    try {
      return JSON.parse(data);
    } catch (e) {
      return fallback;
    }
  },
  save: <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('db-sync', { detail: { collection: key } }));
  }
};

// Track if backend is available
let isBackendAvailable = false;

const checkBackend = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/warehouses`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    isBackendAvailable = res.ok;
    return isBackendAvailable;
  } catch {
    isBackendAvailable = false;
    return false;
  }
};

export const mockApi = {
  initializeDatabase: async () => {
    // Check if backend is available
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      console.log('✅ Connected to MongoDB backend');
    } else {
      console.log('⚠️ Backend not available, using local storage');
      // Fall back to local storage
      if (!localStorage.getItem('ps_initialized_v3')) {
        LocalDB.save('ps_warehouses', DEFAULT_WAREHOUSES);
        LocalDB.save('ps_routes', DEFAULT_ROUTES);
        LocalDB.save('ps_demand', DEFAULT_DEMAND);
        localStorage.setItem('ps_initialized_v3', 'true');
      }
    }
  },

  resetDatabase: async () => {
    localStorage.clear();
    location.reload();
  },

  // --- AUTH ---
  login: async (email: string, password: string): Promise<User> => {
    if (email === 'mohit' && password === '123') {
      const user: User = { id: 'admin-1', name: 'Mohit', email: 'mohit@pulselogix.io', role: 'admin' };
      LocalDB.save(DB_KEYS.SESSION, user);
      return user;
    }
    const users = LocalDB.get<any[]>(DB_KEYS.USERS, []);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const sessionUser: User = { id: user.id, name: user.name, email: user.email, role: user.role };
    LocalDB.save(DB_KEYS.SESSION, sessionUser);
    return sessionUser;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const users = LocalDB.get<any[]>(DB_KEYS.USERS, []);
    if (users.find(u => u.email === email)) throw new Error('User already exists');
    const newUser = { id: `u-${Date.now()}`, name, email, password, role: 'user' as const };
    LocalDB.save(DB_KEYS.USERS, [...users, newUser]);
    const session: User = { id: newUser.id, name, email, role: 'user' };
    LocalDB.save(DB_KEYS.SESSION, session);
    return session;
  },
  
  logout: async () => {
    localStorage.removeItem(DB_KEYS.SESSION);
  },

  getCurrentUser: (): User | null => {
    return LocalDB.get<User | null>(DB_KEYS.SESSION, null);
  },

  // --- WAREHOUSES ---
  getWarehouses: async (): Promise<Warehouse[]> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/warehouses`);
        const data = await res.json();
        return data.map(convertWarehouse);
      } catch (e) {
        console.error('Error fetching warehouses:', e);
      }
    }
    // Fallback to local storage
    return LocalDB.get(DB_KEYS.WAREHOUSES, DEFAULT_WAREHOUSES);
  },

  getWarehouseById: async (id: string): Promise<Warehouse | undefined> => {
    const whs = await mockApi.getWarehouses();
    return whs.find(w => w.id === id);
  },

  addWarehouse: async (wh: Omit<Warehouse, 'id'>): Promise<Warehouse> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      const res = await fetch(`${API_BASE}/warehouses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wh)
      });
      const data = await res.json();
      return convertWarehouse(data);
    }
    // Fallback to local storage
    const whs = await mockApi.getWarehouses();
    const newWh = { ...wh, id: `wh-${Date.now()}` };
    LocalDB.save(DB_KEYS.WAREHOUSES, [...whs, newWh]);
    return newWh;
  },

  updateWarehouse: async (id: string, updates: Partial<Warehouse>): Promise<Warehouse | undefined> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      const res = await fetch(`${API_BASE}/warehouses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      return convertWarehouse(data);
    }
    // Fallback
    const whs = await mockApi.getWarehouses();
    const updated = whs.map(w => w.id === id ? { ...w, ...updates } : w);
    LocalDB.save(DB_KEYS.WAREHOUSES, updated);
    return updated.find(w => w.id === id);
  },

  deleteWarehouse: async (id: string): Promise<void> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      await fetch(`${API_BASE}/warehouses/${id}`, { method: 'DELETE' });
      return;
    }
    // Fallback
    const whs = await mockApi.getWarehouses();
    LocalDB.save(DB_KEYS.WAREHOUSES, whs.filter(w => w.id !== id));
  },

  // --- ROUTES ---
  getRoutes: async (): Promise<ShippingRoute[]> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/routes`);
        const data = await res.json();
        return data.map(convertRoute);
      } catch (e) {
        console.error('Error fetching routes:', e);
      }
    }
    return LocalDB.get(DB_KEYS.ROUTES, DEFAULT_ROUTES);
  },

  addRoute: async (route: Omit<ShippingRoute, 'id'>): Promise<ShippingRoute> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      const res = await fetch(`${API_BASE}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route)
      });
      const data = await res.json();
      return convertRoute(data);
    }
    // Fallback
    const rs = await mockApi.getRoutes();
    const newRoute = { ...route, id: `r-${Date.now()}`, timestamp: new Date().toISOString() };
    LocalDB.save(DB_KEYS.ROUTES, [...rs, newRoute]);
    return newRoute;
  },

  updateRoute: async (id: string, updates: Partial<ShippingRoute>): Promise<ShippingRoute | undefined> => {
    const rs = await mockApi.getRoutes();
    const updated = rs.map(r => r.id === id ? { ...r, ...updates } : r);
    LocalDB.save(DB_KEYS.ROUTES, updated);
    return updated.find(r => r.id === id);
  },

  deleteRoute: async (id: string): Promise<void> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      await fetch(`${API_BASE}/routes/${id}`, { method: 'DELETE' });
      return;
    }
    // Fallback
    const rs = await mockApi.getRoutes();
    LocalDB.save(DB_KEYS.ROUTES, rs.filter(r => r.id !== id));
  },

  // --- DEMAND ---
  getDemand: async (): Promise<DemandData[]> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/demand`);
        const data = await res.json();
        return data.map(convertDemand);
      } catch (e) {
        console.error('Error fetching demand:', e);
      }
    }
    return LocalDB.get(DB_KEYS.DEMAND, DEFAULT_DEMAND);
  },

  updateDemand: async (updates: DemandData[]): Promise<DemandData[]> => {
    const backendAvailable = await checkBackend();
    if (backendAvailable) {
      try {
        // Send all demand data to backend via PUT request
        const res = await fetch(`${API_BASE}/demand`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          return updates;
        }
      } catch (e) {
        console.error('Error updating demand:', e);
      }
    }
    // Fallback to local storage
    LocalDB.save(DB_KEYS.DEMAND, updates);
    return updates;
  },

  getRawDatabase: async () => {
    return {
      warehouses: await mockApi.getWarehouses(),
      routes: await mockApi.getRoutes(),
      demand: await mockApi.getDemand(),
      users: LocalDB.get(DB_KEYS.USERS, [])
    };
  },

  runSimulation: async (disruptions: { type: string; intensity: number }[]) => {
    const whs = await mockApi.getWarehouses();
    const baseCost = whs.length * 40000;
    let costMult = 1.0;
    let serviceHit = 0;
    let impacts: string[] = [];
    
    disruptions.forEach(d => {
      if (d.type === 'shutdown') { costMult += 0.3; serviceHit += 20; impacts.push('Critical Node Down'); }
      if (d.type === 'delay') { costMult += 0.1; serviceHit += 8; impacts.push('Route Lag'); }
      if (d.type === 'spike') { costMult += 0.4; serviceHit += 15; impacts.push('Demand Surge'); }
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Dynamic Simulation',
      timestamp: new Date().toISOString(),
      totalCost: baseCost * costMult,
      averageLeadTime: 2.4 * (disruptions.length ? 1.4 : 1),
      serviceLevel: Math.max(0, 98.5 - serviceHit),
      disruptions: impacts,
      metrics: { inventoryHoldingCost: 35, transportationCost: 65, backlogRisk: serviceHit }
    };
  }
};
