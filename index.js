const express = require("express");
const { PORT } = require("./config/env");
const authRoute = require("./routes/authRoute");
const connectDB = require("./config/DB");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Create Express app
const app = express();

// List of allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://qr-code-generator-eight-henna.vercel.app",
];

// ✅ Enable CORS correctly
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());



// ✅ Connect to the database
connectDB();

// ✅ Use routes
app.use("/api/v1/auth", authRoute);

// ✅ Test endpoint
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});



// ✅ Export for Vercel deployment
module.exports = app;

// ✅ Run server in local mode
if (process.env.NODE_ENV !== "vercel") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}