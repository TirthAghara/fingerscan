const mongoose = require('mongoose');

const FingerprintUserSchema = new mongoose.Schema({
  name: String,
  father_name: String,
  surname: String,
  mother_name: String,
  school_name: String,
  medium_of_study: String,
  gender: String,
  birthdate: String,
  occupation: String,
  contact: String,
  email: String,
  address: String,
  city: String,
  district: String,
  state: String,
  remarks: String
});

module.exports = mongoose.model('FingerprintUser', FingerprintUserSchema);
