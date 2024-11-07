// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// Initialize app and server
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB setup
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Database connection error:', err));

// Serve static files
app.use(express.static('public'));

// Import PassengerCount model
const PassengerCount = require('./models/PassengerCount');

// Use the auth routes
app.use('https://bus-transit-phi.vercel.app/api/auth', authRoutes);

let passengerCounts = []; // Store counts temporarily for periodic saving

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
      return next(new Error("Authentication error"));
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
  } catch (err) {
      return next(new Error("Invalid token"));
  }
});


io.sockets.on('connection', (socket) => {
  console.log('New authenticated client connected:', socket.user.id);

  // Listen for passenger count from client
  socket.on('passengerCount', (data) => {

    const { count } = data;
    console.log(count)


    // Emit count immediately to all clients
    // io.emit('updateCount', { count });

    // Server-side
  const passengerData = [
    { stopName: "Eziobodo", count: Math.floor(Math.random() * 30) },
    { stopName: "Ihiagwa", count },
    { stopName: "Umuchima", count: Math.floor(Math.random() * 10)  },
    // Add more bus stops with coordinates
  ];

  io.emit("updateCount", passengerData);

    // Store count in memory for periodic database storage
    passengerCounts.push({ timestamp: new Date(), count });
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Save counts to database periodically (e.g., every minute)
setInterval(async () => {
  if (passengerCounts.length > 0) {
    await PassengerCount.insertMany(passengerCounts);
    passengerCounts = []; // Clear the array after saving
  }
}, 60000); // Save every 60 seconds

// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
