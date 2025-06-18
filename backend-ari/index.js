const express = require('express');
const cors = require('cors');
const conversionRoutes = require('./src/routes/conversion.routes');

const app = express();

// CORS configuration
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    console.log('Health check requested');
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/conversion', conversionRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(`- Health check: http://localhost:${PORT}/api/health`);
    console.log(`- Conversion: http://localhost:${PORT}/api/conversion`);
});

module.exports = app;
