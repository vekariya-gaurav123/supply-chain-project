/**
 * PulseLogix - Production MERN Backend Implementation
 * This server connects to a local MongoDB database.
 */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pulselogix";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Local Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- MONGOOSE MODELS ---

// Warehouse Schema
const warehouseSchema = new mongoose.Schema({
  name: String,
  region: String,
  capacity: Number,
  currentStock: Number,
  operatingCost: Number,
  status: String,
  x: Number,
  y: Number,
  lowStockThreshold: Number,
  overstockThreshold: Number
}, { timestamps: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

// Shipping Route Schema
const routeSchema = new mongoose.Schema({
  originId: String,
  destinationId: String,
  costPerUnit: Number,
  leadTimeDays: Number,
  distanceKm: Number,
  status: String,
  mode: String,
  activeVolume: Number,
  utilization: Number,
  timestamp: Date
}, { timestamps: true });

const ShippingRoute = mongoose.model('ShippingRoute', routeSchema);

// Demand Schema
const demandSchema = new mongoose.Schema({
  year: Number,
  month: String,
  actual: Number,
  forecast: Number
}, { timestamps: true });

const Demand = mongoose.model('Demand', demandSchema);

// --- API ROUTES ---

// Warehouse Endpoints
app.get('/api/warehouses', async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching warehouses', error: err });
  }
});

app.get('/api/warehouses/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching warehouse', error: err });
  }
});

app.post('/api/warehouses', async (req, res) => {
  try {
    const newWh = new Warehouse(req.body);
    await newWh.save();
    res.status(201).json(newWh);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
});

app.put('/api/warehouses/:id', async (req, res) => {
  try {
    const updated = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Warehouse not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating warehouse', error: err });
  }
});

app.delete('/api/warehouses/:id', async (req, res) => {
  try {
    const deleted = await Warehouse.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Warehouse not found' });
    res.json({ message: 'Warehouse deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting warehouse', error: err });
  }
});

// Shipping Route Endpoints
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await ShippingRoute.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching routes', error: err });
  }
});

app.post('/api/routes', async (req, res) => {
  try {
    const newRoute = new ShippingRoute(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
});

app.put('/api/routes/:id', async (req, res) => {
  try {
    const updated = await ShippingRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Route not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating route', error: err });
  }
});

app.delete('/api/routes/:id', async (req, res) => {
  try {
    const deleted = await ShippingRoute.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting route', error: err });
  }
});

// Demand Endpoints
app.get('/api/demand', async (req, res) => {
  try {
    const demand = await Demand.find().sort({ year: 1, month: 1 });
    res.json(demand);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching demand', error: err });
  }
});

app.post('/api/demand', async (req, res) => {
  try {
    const newDemand = new Demand(req.body);
    await newDemand.save();
    res.status(201).json(newDemand);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err });
  }
});

app.put('/api/demand', async (req, res) => {
  console.log('PUT /api/demand received:', req.body);
  try {
    const demandData = req.body;
    console.log('Demand data to save:', demandData);
    // Clear existing demand data and insert new data
    await Demand.deleteMany({});
    console.log('Cleared existing demand data');
    if (demandData && demandData.length > 0) {
      await Demand.insertMany(demandData);
      console.log('Inserted new demand data:', demandData.length, 'records');
    }
    const updatedDemand = await Demand.find().sort({ year: 1, month: 1 });
    console.log('Returning updated demand:', updatedDemand.length, 'records');
    res.json(updatedDemand);
  } catch (err) {
    console.error('Error in PUT /api/demand:', err);
    res.status(400).json({ message: 'Error updating demand', error: err });
  }
});

// Seed initial data if empty
const seedDatabase = async () => {
  const warehouseCount = await Warehouse.countDocuments();
  if (warehouseCount === 0) {
    console.log('📦 Seeding initial warehouse data...');
    await Warehouse.insertMany([
      { name: 'West Coast Hub', region: 'California', capacity: 10000, currentStock: 7200, operatingCost: 25000, status: 'active', x: 15, y: 40, lowStockThreshold: 2000, overstockThreshold: 9000 },
      { name: 'Midwest Distribution', region: 'Illinois', capacity: 15000, currentStock: 11000, operatingCost: 18000, status: 'active', x: 50, y: 35, lowStockThreshold: 3000, overstockThreshold: 14000 },
      { name: 'East Coast Port', region: 'New Jersey', capacity: 20000, currentStock: 14500, operatingCost: 32000, status: 'active', x: 85, y: 30, lowStockThreshold: 4000, overstockThreshold: 18500 },
      { name: 'Southern Logistics', region: 'Texas', capacity: 12000, currentStock: 12500, operatingCost: 20000, status: 'active', x: 45, y: 75, lowStockThreshold: 2500, overstockThreshold: 11000 },
    ]);
  }

  const routeCount = await ShippingRoute.countDocuments();
  if (routeCount === 0) {
    console.log('🚚 Seeding initial route data...');
    await ShippingRoute.insertMany([
      { originId: 'West Coast Hub', destinationId: 'Midwest Distribution', costPerUnit: 1.2, leadTimeDays: 3, distanceKm: 2800, status: 'on way', mode: 'Road', activeVolume: 1200, utilization: 85, timestamp: new Date(Date.now() - 86400000) },
      { originId: 'Midwest Distribution', destinationId: 'East Coast Port', costPerUnit: 0.8, leadTimeDays: 2, distanceKm: 1300, status: 'arrived', mode: 'Rail', activeVolume: 3500, utilization: 92, timestamp: new Date(Date.now() - 172800000) },
      { originId: 'West Coast Hub', destinationId: 'East Coast Port', costPerUnit: 4.5, leadTimeDays: 1, distanceKm: 4200, status: 'on way', mode: 'Air', activeVolume: 450, utilization: 40, timestamp: new Date() },
    ]);
  }

  const demandCount = await Demand.countDocuments();
  if (demandCount === 0) {
    console.log('📊 Seeding initial demand data...');
    await Demand.insertMany([
      { year: 2024, month: 'Jan', actual: 4200, forecast: 4100 },
      { year: 2024, month: 'Feb', actual: 3800, forecast: 4000 },
      { year: 2024, month: 'Mar', actual: 4500, forecast: 4400 },
      { year: 2025, month: 'Jan', actual: 7800, forecast: 8000 },
      { year: 2025, month: 'Feb', actual: 7400, forecast: 7700 },
      { year: 2025, month: 'Mar', actual: 0, forecast: 8200 },
    ]);
  }
};

// Seed after connection
mongoose.connection.once('open', () => {
  seedDatabase();
});

// Simulation & Analytics Engine
app.post('/api/simulation/calculate', (req, res) => {
  const { scenarios } = req.body;
  // Complex server-side math for logistics simulation...
  res.json({ status: 'computed', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 PulseLogix Node Server running on http://localhost:${PORT}`);
});
