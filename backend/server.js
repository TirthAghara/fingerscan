const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db'); // MongoDB connection

const User = require('./models/User');
const FingerprintUser = require('./models/FingerprintUser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ message: 'Login success', username });
  } else {
    res.status(401).json({ message: 'Invalid login' });
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

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
