const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csvtojson');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 

const uri = 'mongodb+srv://kenvortex19_db_user:1234@cluster0.vh06fcu.mongodb.net/';

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'student' } 
});

const User = mongoose.model('users', UserSchema);

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'], 
  credentials: true 
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadscsv/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload-student-credentials', upload.single('file'), async (req, res) => {
  try {
    const users = await csv().fromFile(req.file.path);

    const processedUsers = await Promise.all(users.map(async user => {
      const hashedPassword = await bcrypt.hash(user.ROLL_NUMBER, 10);
      return {
        email: user.EMAIL,
        password: hashedPassword,
        userType: 'student'
      };
    }));

    await User.insertMany(processedUsers);
    
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.status(200).send('Users imported successfully');
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(500).send('Error importing users');
  }
});
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
