// models/PassengerCount.js
const mongoose = require('mongoose');

const PassengerCountSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  count: { type: Number, required: true }
});

module.exports = mongoose.model('PassengerCount', PassengerCountSchema);
