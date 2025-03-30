import express from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';
import hubRoutes from './routes/hubRoutes.js';
import productRoutes from './routes/productRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import socialRoutes from './routes/socialRoutes.js';

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Use CORS with the specified options
app.use(cors());

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// User routes
app.use('/api/user', userRoutes);

// Hub Routes
app.use('/api/hub', hubRoutes);

//Product routes
app.use('/api/product', productRoutes);

// Service Routes
app.use('/api/service', serviceRoutes);

// Social Routes
app.use('/api/socials', socialRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});