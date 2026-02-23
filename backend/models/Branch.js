const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    branchName: String,
    branchCode: String,
    address: String,
    city: String,
    contact: String,
    status: String
});

module.exports = mongoose.model('Branch', BranchSchema);