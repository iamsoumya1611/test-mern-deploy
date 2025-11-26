const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with specific origin
app.use(cors({
    origin: '*',
    credentials: true
}));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Routes
app.use('/users', require('./routes/userRoutes'));

// For cPanel, we need to use the port provided in the environment
const PORT = process.env.PORT || 3000;

// Log any unhandled errors
process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection:', err);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('MongoDB URI:', process.env.MONGO_URI); // To verify connection string in logs
});