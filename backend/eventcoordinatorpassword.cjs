const express = require('express');
const mongoose = require('mongoose');
const csv = require('csvtojson');
const multer = require('multer');
const cors = require('cors'); // Import the CORS package
const path = require('path');
const fs = require('fs'); // Import fs for file deletion

// MongoDB connection string
const uri = 'mongodb+srv://ragavr33:rudu007@student.mrg3e.mongodb.net/ODClaimerDB?retryWrites=true&w=majority';
const app = express();
const port = 4000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend origin
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true // Allow credentials if needed
}));

// Ensure upload directory exists
const uploadDir = 'uploadscsv/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure this folder exists or create it
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Define User Schema for Event Coordinators
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'eventCoordinator' }
});

const User = mongoose.model('eventcoordinatorpasswords', UserSchema);

// Upload Event Coordinator Password CSV endpoint
app.post('/upload-event-coordinator-passwords', upload.single('file'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert CSV to JSON
    const users = await csv().fromFile(req.file.path);

    // Process users
    const processedUsers = users.map(user => ({
      email: user.EventcoordinatorEmail,
      password: user.Eventcoordinatorrollno,
      userType: 'eventCoordinator'
    }));

    // Insert users into MongoDB with upsert to handle duplicates
    const bulkOps = processedUsers.map(user => ({
      updateOne: {
        filter: { email: user.email }, // Find by email
        update: { $setOnInsert: user }, // Insert if not exists
        upsert: true // Create a new document if no match found
      }
    }));

    const result = await User.bulkWrite(bulkOps);
    console.log('Users imported successfully:', result);
    res.status(200).json({ message: 'Users imported successfully', result });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(500).json({ error: 'Error importing users', details: error.message }); // Include error details
  } finally {
    // Optionally delete the uploaded file after processing
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
