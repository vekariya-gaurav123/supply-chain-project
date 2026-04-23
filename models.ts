
import { Warehouse, ShippingRoute, DemandData, TransportMode } from './types';

/**
 * These are conceptual Mongoose schemas that would be used in a real Node.js/MongoDB environment.
 */

export const WarehouseSchema = {
  name: { type: String, required: true },
  region: { type: String, required: true },
  capacity: { type: Number, required: true, min: 0 },
  currentStock: { type: Number, required: true, min: 0 },
  operatingCost: { type: Number, required: true },
  status: { type: String, enum: ['active', 'shutdown'], default: 'active' },
  x: { type: Number },
  y: { type: Number },
  lowStockThreshold: { type: Number },
  overstockThreshold: { type: Number }
};

export const ShippingRouteSchema = {
  originId: { type: 'ObjectId', ref: 'Warehouse', required: true },
  destinationId: { type: 'ObjectId', ref: 'Warehouse', required: true },
  costPerUnit: { type: Number, required: true },
  leadTimeDays: { type: Number, required: true },
  distanceKm: { type: Number, required: true },
  status: { type: String, enum: ['normal', 'delayed', 'risk'], default: 'normal' },
  mode: { type: String, enum: ['Road', 'Rail', 'Air', 'Sea'], default: 'Road' },
  activeVolume: { type: Number, default: 0 },
  utilization: { type: Number, default: 0, min: 0, max: 100 }
};

export const DemandDataSchema = {
  year: { type: Number, required: true },
  month: { type: String, required: true },
  actual: { type: Number, default: 0 },
  forecast: { type: Number, required: true }
};
