require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
connectDB(); // MongoDB connection

const User = require('./models/User');
const FingerprintUser = require('./models/FingerprintUser');
const Branch = require('./models/Branch');
const fingerprintRoutes = require('./routes/fingerprint');


const allowedOrigins = [
  "https://fingerscan-frontend.onrender.com", // Live URL
  "http://localhost:3000"                     // Local Development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use('/api/fingerprint', fingerprintRoutes);
app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.render("index", { name: "Tirth" });
});

/* REGISTER */
app.post('/register', async (req, res) => {
  const { username, password, email, phonenumber, address } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User exists' });
    }

    await User.create({ username, password, email, phonenumber, address });
    res.json({ message: 'Registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* LOGIN */
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        password: user.password,
        email: user.email,
        phonenumber: user.phonenumber,
        address: user.address
      }
    });

  } catch (error) {
  console.error("Login Error:", error); // Ye Render Logs me dikhega
  res.status(500).json({ message: error.message }); // Ye frontend par dikhega
}
});


/* FINGERPRINT FORM */
app.post('/fingerprint_users', async (req, res) => {
  try {
    const data = await FingerprintUser.create(req.body);
    res.json({ message: 'Fingerprint data saved', id: data._id });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});


// ADD BRANCH
app.post('/add-branch', async (req, res) => {
  try {
    const data = await Branch.create(req.body);
    res.json({ message: 'Branch added', id: data._id });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

// VIEW BRANCHES
app.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

onnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log("📂 Database status: Connected and Ready");
    });
}).catch((err) => {
    console.error("❌ Critical: Server could not start because DB connection failed.");
    console.error("Error Details:", err.message);
});