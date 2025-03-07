// import all required modules
const express = require('express');
const { PORT } = require('./config/env');
const authRoute = require('./routes/authRoute'); 
const connectDB = require('./config/DB');
const cookieParser = require('cookie-parser');
const cors = require('cors')

// Create an Express app
const app = express();

// Enable CORS
app.use(cors())
app.use(cors({
  origin: "http://localhost:5173" || "https://qr-code-generator-eight-henna.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use the authRoute for /api/v1/auth routes
app.use('/api/v1/auth', authRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});