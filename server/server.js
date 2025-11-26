const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Body parser
app.use(express.json());

// Enable CORS with specific origin and methods
app.use(cors({
    origin: ['https://test-mern-deploy-zeta.vercel.app', 'http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Test CORS endpoint
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// For cPanel, we need to use the port provided in the environment
const PORT = process.env.PORT || 5000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err.message);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Connected' : 'Not found');
    console.log('CORS origins:', ['https://test-mern-deploy-zeta.vercel.app', 'http://localhost:3000', 'http://localhost:5000']);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});