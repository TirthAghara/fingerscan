const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/fingerprintDB')
  .then(() => console.log('MongoDB connected locally'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
