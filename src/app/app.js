//importing the required modules
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const connectToDatabase = require("../config/db");
const morgon = require("morgan");
const MongoStore = require("connect-mongo");
const app = express();

// Socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server ,{
  cors: {
      origin: "http://localhost:3000", // Change this to your client's origin
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
  },
}  );


exports.io = io;


// import all Route files
const authRoutes = require("../route/auth.route");
const userRoutes = require("../route/user.route");
const postRoutes = require("../route/post.route");

// express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    },
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
      collectionName: "sessions",
    }),
  })
);

// Global Middlewares
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(morgon("dev")); // Log requests to the console

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // The client origin
    credentials: true, // Allow cookies and credentials to be shared
    allowedHeaders: ["Authorization", "Content-Type"], // Allow required headers
  })
);

// set up socket.io
// app.set("io", io);

// Connect to the database
connectToDatabase();

// Use the routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

server.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});

module.exports = {app};
