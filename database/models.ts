import mongoose, { Schema, Document } from 'mongoose';

// Warehouse Model
export interface IWarehouse extends Document {
  name: string;
  region: string;
  capacity: number;
  currentStock: number;
  operatingCost: number;
  status: 'active' | 'shutdown';
  x?: number;
  y?: number;
  lowStockThreshold?: number;
  overstockThreshold?: number;
}

const WarehouseSchema = new Schema<IWarehouse>({
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
});

// ShippingRoute Model
export interface IShippingRoute extends Document {
  originId: mongoose.Types.ObjectId;
  destinationId: mongoose.Types.ObjectId;
  costPerUnit: number;
  leadTimeDays: number;
  distanceKm: number;
  status: 'normal' | 'delayed' | 'risk';
  mode: 'Road' | 'Rail' | 'Air' | 'Sea';
  activeVolume: number;
  utilization: number;
}

const ShippingRouteSchema = new Schema<IShippingRoute>({
  originId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  destinationId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  costPerUnit: { type: Number, required: true },
  leadTimeDays: { type: Number, required: true },
  distanceKm: { type: Number, required: true },
  status: { type: String, enum: ['normal', 'delayed', 'risk'], default: 'normal' },
  mode: { type: String, enum: ['Road', 'Rail', 'Air', 'Sea'], default: 'Road' },
  activeVolume: { type: Number, default: 0 },
  utilization: { type: Number, default: 0, min: 0, max: 100 }
});

// DemandData Model
export interface IDemandData extends Document {
  year: number;
  month: string;
  actual: number;
  forecast: number;
}

const DemandDataSchema = new Schema<IDemandData>({
  year: { type: Number, required: true },
  month: { type: String, required: true },
  actual: { type: Number, default: 0 },
  forecast: { type: Number, required: true }
});

// Export models
export const Warehouse = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
export const ShippingRoute = mongoose.model<IShippingRoute>('ShippingRoute', ShippingRouteSchema);
export const DemandData = mongoose.model<IDemandData>('DemandData', DemandDataSchema);
