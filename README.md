# PulseLogix - Intelligent Supply Chain Simulation Platform

![PulseLogix Dashboard](dashboard-preview.png)

PulseLogix is a cutting-edge **Intelligent Supply Chain Simulation Platform** built on the MERN stack. It provides real-time visibility into warehouse operations, shipping routes, and demand forecasting, enabling businesses to optimize their logistics and supply chain efficiency through data-driven insights.

## 🚀 Key Features

- **Warehouse Intelligence**: Monitor stock levels, operating costs, and capacity utilization across multiple regions with automated low-stock alerts.
- **Route Optimization**: Track shipping routes across different modes (Road, Rail, Air) with real-time lead time and cost analysis.
- **Demand Forecasting**: Visualize historical data vs. AI-driven forecasts to ensure inventory alignment with market trends.
- **Logistics Simulation**: Run server-side simulation scenarios to predict the impact of logistics changes before implementation.
- **Interactive Dashboard**: A premium, responsive interface featuring dynamic charts and maps for a comprehensive overview of the supply chain.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Recharts, Lucide React
- **Backend**: Node.js, Express 5
- **Database**: MongoDB (Mongoose)
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vekariya-gaurav123/supply-chain-project.git
   cd supply-chain-project/supply-chain-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file or use the default local connection in `server.ts`.
   ```env
   MONGODB_URI=mongodb://localhost:27017/pulselogix
   PORT=5000
   ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   npm run server
   ```

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend API).

## 📊 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/warehouses` | GET | Fetch all warehouses |
| `/api/routes` | GET | Fetch all shipping routes |
| `/api/demand` | GET | Fetch demand history and forecasts |
| `/api/simulation/calculate` | POST | Run logistics simulation calculations |

---

Developed with ❤️ for optimized logistics.
