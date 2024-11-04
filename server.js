// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./authRoutes');
require('dotenv').config();

// Initialize app and server
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB setup
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Serve static files
app.use(express.static('public'));

// Import PassengerCount model
const PassengerCount = require('./models/PassengerCount');

// Use the auth routes
app.use('/api/auth', authRoutes);

let passengerCounts = []; // Store counts temporarily for periodic saving

io.sockets.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for passenger count from client
  socket.on('passengerCount', (data) => {

    const { count } = data;
    console.log(count)


    // Emit count immediately to all clients
    // io.emit('updateCount', { count });

    // Server-side
  setInterval(() => {
    const passengerData = [
      { stopName: "Eziobodo", count: Math.floor(Math.random() * 30) },
      { stopName: "Ihiagwa", count },
      { stopName: "Umuchima", count: Math.floor(Math.random() * 10)  },
      // Add more bus stops with coordinates
    ];
    io.emit("updateCount", passengerData);
  }, 5000);



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
