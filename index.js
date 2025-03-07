const express = require("express");
const { PORT } = require("./config/env");
const authRoute = require("./routes/authRoute");
const connectDB = require("./config/DB");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Create an Express app
const app = express();

// List of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://qr-code-generator-eight-henna.vercel.app",
];

// Dynamically allow CORS based on request origin
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Use the authRoute for /api/v1/auth routes
app.use("/api/v1/auth", authRoute);

// ✅ Export the app for Vercel
module.exports = app;

// ✅ Start server only if running locally
if (process.env.NODE_ENV !== "vercel") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
