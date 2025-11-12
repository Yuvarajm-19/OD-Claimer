const mongoose = require('mongoose');
const csv = require('csvtojson');
const path = require('path');

// MongoDB connection string
const uri = 'mongodb+srv://ragavr33:rudu007@student.mrg3e.mongodb.net/ODClaimerDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Define User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'student' } // Assuming all are students
});

const User = mongoose.model('TeachersPassword', UserSchema);

// CSV file path
// Go one folder up (`..`) and then into the CSVFILES folder to access PASSWORD.csv
const csvFilePath = path.join(__dirname, '../CSVFILES/TEACHERSDATA.csv');

// Function to import CSV data into MongoDB
const importUsers = async () => {
  try {
    // Convert CSV to JSON
    const users = await csv().fromFile(csvFilePath);

    // Process users: Use roll number as password and email as email
    const processedUsers = users.map(user => {
      return {
        email: user.CAEMAIL,
        password: user.CADOB, // Use roll number directly without hashing
        userType: 'teacher' // Set userType as teacher
      };
    });

    // Insert users into MongoDB
    await User.insertMany(processedUsers);
    console.log('Users imported successfully');

    // Close the MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing users:', error);
  }
};

// Run the import function
importUsers();
