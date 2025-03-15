import express from 'express';
import cors from 'cors';
import userRoutes from './routes/UserRoutes.js';

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});