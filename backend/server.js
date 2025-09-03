const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productivity-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Time Tracking Schema
const timeTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  domain: { type: String, required: true },
  timeSpent: { type: Number, required: true },
  category: { type: String, enum: ['productive', 'unproductive', 'neutral'], required: true },
  date: { type: Date, default: Date.now },
  timestamp: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);
const TimeTracking = mongoose.model('TimeTracking', timeTrackingSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Store time tracking data
app.post('/api/time-tracking', async (req, res) => {
  try {
    const { domain, timeSpent, category, timestamp } = req.body;
    
    const timeTracking = new TimeTracking({
      domain,
      timeSpent,
      category,
      timestamp: new Date(timestamp)
    });
    
    await timeTracking.save();
    res.json({ message: 'Time tracking data saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user.userId;
    
    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setDate(startDate.getDate() - 1);
    }
    
    const data = await TimeTracking.find({
      userId,
      timestamp: { $gte: startDate }
    });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily analytics (public endpoint for demo)
app.get('/api/analytics/daily', async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const data = await TimeTracking.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            domain: '$domain',
            category: '$category'
          },
          totalTime: { $sum: '$timeSpent' }
        }
      },
      {
        $sort: { totalTime: -1 }
      }
    ]);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly analytics (public endpoint for demo)
app.get('/api/analytics/weekly', async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const data = await TimeTracking.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$timestamp'
              }
            },
            category: '$category'
          },
          totalTime: { $sum: '$timeSpent' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});