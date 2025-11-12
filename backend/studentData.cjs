const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const multer = require('multer');
const cors = require('cors'); // Import the CORS package
const path = require('path');

// MongoDB connection string
const uri = 'mongodb+srv://ragavr33:rudu007@student.mrg3e.mongodb.net/ODClaimerDB?retryWrites=true&w=majority';
const app = express();
const port = 1000;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend's URL if different
  methods: ['GET', 'POST'], // Allow specific methods
  credentials: true // Allow credentials if needed
}));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadscsv/'); // Ensure this folder exists or create it
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

// Define the schema for Student
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  year: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  classAdvisor: { type: String, required: true },
  mode: { type: String, required: true },
});

const Student = mongoose.model('students', studentSchema);

// Upload CSV endpoint
app.post('/upload-student-data', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path) // Read the uploaded file
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      try {
        for (const studentData of results) {
          const student = new Student({
            rollNumber: studentData.ROLL_NUMBER,
            name: studentData.NAME,
            class: studentData.CLASS,
            year: studentData.YEAR,
            email: studentData.EMAIL,
            dob: new Date(studentData.DOB), // Convert DOB to a Date object
            department: studentData.DEPARTMENT,
            classAdvisor: studentData.CLASS_ADVISOR,
            mode: studentData.MODE,
          });
          
          await student.save(); // Save each student to the database
        }
        console.log("CSV data uploaded successfully.");
        res.status(200).json({ message: 'CSV data uploaded successfully.' });
      } catch (err) {
        console.error("Error uploading CSV data:", err);
        res.status(500).json({ error: 'Error uploading CSV data' });
      } finally {
        // Optionally delete the uploaded file after processing
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
