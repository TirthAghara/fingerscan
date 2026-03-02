// const mongoose = require('mongoose');

// mongoose.connect('https://fingerscan-4.onrender.com')
//   .then(() => console.log('MongoDB connected locally'))
//   .catch(err => console.error('MongoDB connection error:', err));

// module.exports = mongoose;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


// mongodb+srv://tirthaghara_db:<db_password>@cluster0.gdd6zjn.mongodb.net/?appName=Cluster0";
