
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  region: string;
  capacity: number; // in units
  currentStock: number;
  operatingCost: number; // per month
  status: 'active' | 'shutdown';
  x: number; // For visualization map coordinate (0-100)
  y: number; // For visualization map coordinate (0-100)
  lowStockThreshold?: number;
  overstockThreshold?: number;
}

export type TransportMode = 'Road' | 'Rail' | 'Air' | 'Sea';
export type RouteStatus = 'on way' | 'arrived' | 'delayed' | 'cancelled';

export interface ShippingRoute {
  id: string;
  originId: string;
  destinationId: string;
  costPerUnit: number;
  leadTimeDays: number;
  distanceKm: number;
  status: RouteStatus;
  mode: TransportMode;
  activeVolume: number; // Units currently in transit
  utilization: number; // Percentage of fleet capacity used
  timestamp: string; // Date and time when the route/order was established
}

export interface SimulationResult {
  id: string;
  name: string;
  timestamp: string;
  totalCost: number;
  averageLeadTime: number;
  serviceLevel: number; // percentage
  disruptions: string[];
  metrics: {
    inventoryHoldingCost: number;
    transportationCost: number;
    backlogRisk: number;
  };
}

export interface DemandData {
  year: number;
  month: string;
  actual: number;
  forecast: number;
}
