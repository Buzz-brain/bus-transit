// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Initialize app and server
const app = express();
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

io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for passenger count from client
  socket.on('passengerCount', async (data) => {
    const { count } = data;

    // // Save count to database
    // const newCount = new PassengerCount({ count });
    // await newCount.save();

    // Emit count to all clients to update their dashboards
    io.emit('updateCount', { count });
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
