const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');

// MongoDB connection string
const uri = 'mongodb+srv://ragavr33:rudu007@student.mrg3e.mongodb.net/ODClaimerDB?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully.");
    uploadCSV(); // Call the function to upload CSV data
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Define the schema for Teacher
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  department: { type: String, required: true },
  dob: { type: String, required: true }, // Store dob as a string now
  college: { type: String, required: true },
});

const Teacher = mongoose.model('TeachersData', teacherSchema);

// Function to upload CSV data to the Teacher collection
const uploadCSV = () => {
  const results = [];

  fs.createReadStream('../CSVFILES/TEACHERSDATA.csv') // Ensure the correct file path
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      try {
        // Insert each row into the Teacher collection
        for (const teacherData of results) {
          const teacher = new Teacher({
            name: teacherData.CANAME,
            email: teacherData.CAEMAIL,
            class: teacherData.CACLASS,
            department: teacherData.CADEPARTMENT,
            dob: teacherData.CADOB, // Keep dob as a string
            college: teacherData.CACOLLEGE,
          });
          
          await teacher.save(); // Save each teacher to the database
        }
        console.log("CSV data uploaded successfully.");
      } catch (err) {
        console.error("Error uploading CSV data:", err);
      } finally {
        mongoose.connection.close(); // Close the database connection
      }
    });
};
