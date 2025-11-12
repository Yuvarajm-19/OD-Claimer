const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const multer = require('multer');
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');
require('dotenv').config();
app.use(cors({
  origin: ['http://localhost:5173', 'https://od-claimer.vercel.app'],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
const storageUploads = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storageUploads });

const storageEventUploads = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'eventuploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload1 = multer({ storage: storageEventUploads });

const eventSchema = new mongoose.Schema({
rollNumber: String,
name: String,
date: String,
duration: String,
eventName: String,
eventType: String,
collegeName: String,
description: String,
registrationLink: String,
image: String,
});
const Event = mongoose.model('Event', eventSchema);
const uri = "mongodb+srv://ragavr33:rudu007@student.mrg3e.mongodb.net/ODClaimerDB?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  year: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  department: { type: String, required: true },
  classAdvisor: { type: String, required: true },
  mode: { type: String, required: true },
});
const Student = mongoose.model('Student', studentSchema);
const teacherPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
});
const TeacherPassword = mongoose.model('teacherspasswords', teacherPasswordSchema);
const teacherDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  department: { type: String, required: true },
  dob: { type: String, required: true },
  college: { type: String, required: true },
});
const TeacherData = mongoose.model('teachersdatas', teacherDataSchema);
const eventCoordinatorPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
});
const EventCoordinatorPassword = mongoose.model('eventcoordinatorpasswords', eventCoordinatorPasswordSchema);
const eventCoordinatorSchema = new mongoose.Schema({
  timestamp: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  rollNo: { type: String, required: true },
  club: { type: String, required: true },
  position: { type: String, required: true },
  college: { type: String, required: true },
});
const EventCoordinator = mongoose.model('eventcoordinatorsdatas', eventCoordinatorSchema);
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },         
  rollNo: { type: String, required: true },       
  date: { type: Date, required: true },            
  periods: { type: Number, required: true },      
  eventName: { type: String, required: true },    
  collegeName: { type: String, required: true },   
  geotagPhoto: { type: String, required: true },   
  attendancePhoto: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }  
});
const Form = mongoose.model('StudentForm', formSchema); 

const formSchemas = new mongoose.Schema({
  rollNo: String,
  name: String,
  date: Date,
  startPeriod: Number,
  endPeriod: Number,
  eventName: String,
  collegeName: String
});

const Form2 = mongoose.model('odApply', formSchemas);
const newOdSchema = new mongoose.Schema({
  rollNo: String,
  name: String,
  date: Date,
  startPeriod: Number,
  endPeriod: Number,
  eventName: String,
  collegeName: String,
  status: {
    type: String,
    enum: ['Accepted', 'Declined', 'Pending'],
    default: 'Pending'
  }
});

const NewOdCollection = mongoose.model('NewOdCollection', newOdSchema);
const bankSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  periods: { type: Number, required: true }
});

const Bank = mongoose.model('Bank', bankSchema);

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: '10m' }
});

const Otp = mongoose.model('Otp', otpSchema);

app.post('/signin', async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const normalizedEmail = email.toLowerCase();
    if (userType === 'student') {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password1' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password2' });
      }
      const student = await Student.findOne({ email: normalizedEmail });
      return res.status(200).json({ message: 'Login successful', data: { userType, student } });
    } else if (userType === 'teacher') {
      const teacherUser = await TeacherPassword.findOne({ email: normalizedEmail });
      console.log(teacherUser);
      if (!teacherUser) {
        return res.status(401).json({ message: 'Invalid email or password3' });
      }
      if (password !== teacherUser.password) {
        return res.status(401).json({ message: 'Invalid email or password4' });
      }
      const teacherData = await TeacherData.findOne({ email: normalizedEmail });

      console.log(teacherData);
      return res.status(200).json({ message: 'Login successful', data: { userType, teacherData } });
    }
    else if (userType === 'eventCoordinator') {
      const eventCoordinatorUser = await EventCoordinatorPassword.findOne({ email: normalizedEmail });
      if (!eventCoordinatorUser) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      if (password !== eventCoordinatorUser.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const eventCoordinatorData = await EventCoordinator.findOne({ email: normalizedEmail });
      return res.status(200).json({ message: 'Login successful', data: { userType, eventCoordinatorData } });
    }
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});


app.post('/api/events', upload1.single('image'), async (req, res) => {
  try {
    const { rollNumber, name, date, duration, eventName, eventType, collegeName, description, registrationLink } = req.body;
    const image = req.file?.path || '';

    const newEvent = new Event({
      rollNumber,
      name,
      date,
      duration,
      eventName,
      eventType,
      collegeName,
      description,
      registrationLink,
      image,
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully!' });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event', error });
  }
});


app.get('/api/eventcoordinator', async (req, res) => {
  try {
    const eventcoordinator = await EventCoordinator.find();
    console.log(eventcoordinator);
    res.status(200).json({ message: 'Event Coordinator fetched successfully', eventcoordinator });
  } catch (err) {
    console.error("Error fetching EventCoordinator:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});
app.post('/submit-od-form', upload.fields([{ name: 'geotagPhoto' }, { name: 'attendancePhoto' }]), async (req, res) => {
  const { name, rollNo, date, periods, eventName, collegeName } = req.body;
  try {
    const geotagPhoto = req.files['geotagPhoto'][0].path;
    const attendancePhoto = req.files['attendancePhoto'][0].path;
    const newForm = new Form({
      name,
      rollNo,
      date,
      periods,
      eventName,
      collegeName,
      geotagPhoto,
      attendancePhoto
    });
    await newForm.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (err) {
    console.error("Error submitting form:", err);
    res.status(500).json({ message: 'Error submitting form', error: err });
  }
});

app.post('/odapply', async (req, res) => {
  try {
    const { rollNumber, name, date, startPeriod, endPeriod, eventName, collegeName } = req.body;

    // Validate period range
    if (startPeriod < 1 || startPeriod > 8 || endPeriod < 1 || endPeriod > 8) {
      return res.status(400).json({ error: 'Periods must be between 1 and 8' });
    }

    if (startPeriod > endPeriod) {
      return res.status(400).json({ error: 'Start period cannot be greater than end period' });
    }

    const newForm = new Form2({
      rollNo: rollNumber,
      name,
      date,
      startPeriod,
      endPeriod,
      eventName,
      collegeName
    });

    await newForm.save();
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});
app.get('/api/eventsposted', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});
app.get('/api/odapplieslist', async (req, res) => {
  try {
    const records = await Form2.find({});
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.get('/api/od-responses', async (req, res) => {
  try {
    const ev = await NewOdCollection.find();
    res.json(ev);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
});

 app.delete('/api/delete-od-record', async (req, res) => {
  const {
    rollNo,
    name,
    startPeriod,
    endPeriod,
    eventName,
    collegeName
  } = req.body;

  try {
    const deletedRecord = await Form2.findOneAndDelete({
      rollNo,
      name,
      startPeriod,
      endPeriod,
      eventName,
      collegeName
    });

    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});
app.post('/api/new-od-collection', async (req, res) => {
  const {
    rollNo,
    name,
    date,
    startPeriod,
    endPeriod,
    eventName,
    collegeName,
    status
  } = req.body;

  try {
  
    const newRecord = new NewOdCollection({
      rollNo,
      name,
      date,
      startPeriod,
      endPeriod,
      eventName,
      collegeName,
      status
    });

    await newRecord.save();

    await Form2.findOneAndDelete({
      rollNo,
      name,
      date,
      startPeriod,
      endPeriod,
      eventName,
      collegeName
    });

    res.status(201).json({
      message: 'Record processed successfully',
      newRecord
    });
  } catch (error) {
    console.error('Error processing record:', error);
    res.status(500).json({ error: 'Failed to process record' });
  }
});
app.get('/api/studentresponsetoteach', async (req, res) => {
  try {
      const forms = await Form.find({});
      res.json(forms);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching student forms' });
  }
});
app.post('/api/addToBank', async (req, res) => {
  const { rollNo, periods } = req.body;

  try {
  
      const existingRecord = await Bank.findOne({ rollNo });

      if (existingRecord) {
          existingRecord.periods += periods;
          await existingRecord.save();
          return res.status(200).json({ message: 'Periods updated successfully!' });
      } else {
        
          const newRecord = new Bank({ rollNo, periods });
          await newRecord.save();
          return res.status(201).json({ message: 'New record created successfully!' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding to bank' });
  }
});

app.get('/api/bank', async (req, res) => {
  try {
      const records = await Bank.find(); 
      return res.status(200).json(records);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching bank records' });
  }
});
app.delete('/api/deleteStudent', async (req, res) => {
  const { name, rollNo, periods, collegeName, eventName, geotagPhoto, attendancePhoto } = req.body;

  try {
   
      const query = {
          name,
          rollNo,
          periods,
          collegeName,
          eventName,
          geotagPhoto,
          attendancePhoto,
      };

     
      const deletedResponse = await Form.findOneAndDelete(query);


      if (!deletedResponse) {
          return res.status(404).json({ message: 'Student response not found.' }); 
      }

     
      res.status(200).json({ message: 'Student response deleted successfully.' });
  } catch (error) {
      console.error('Error deleting student response:', error);
      res.status(500).json({ message: 'Server error. Please try again.' }); 
  }
});
app.get('/api/newodcollections/:rollNo', async (req, res) => {
  const { rollNo } = req.params;

  try {
    
      const records = await NewOdCollection.find({ rollNo }); 

      if (!records.length) {
          return res.status(404).json({ message: 'No records found for this roll number.' });
      }

      res.status(200).json(records);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching records.' });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'getharsath@gmail.com',
    pass: 'gscp mlta ljbh gdxk',
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification error:", error);
  } else {
    console.log("Server is ready to send emails.");
  }
});



async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: 'getarsath@gmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: 'Your OTP for password reset is:${otp}'
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

app.post('/forgot-password', async (req, res) => {
  const { email, userType } = req.body;
  const normalizedEmail = email.toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {

    await Otp.create({ email: normalizedEmail, otp });


    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error("Error generating OTP:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword, userType } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {

    const otpRecord = await Otp.findOne({ email: normalizedEmail, otp });
    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (userType === 'student') {
      await User.updateOne({ email: normalizedEmail }, { password: hashedPassword });
    } else if (userType === 'teacher') {
      await TeacherPassword.updateOne({ email: normalizedEmail }, { password: hashedPassword });
    } else if (userType === 'eventCoordinator') {
      await EventCoordinatorPassword.updateOne({ email: normalizedEmail }, { password: hashedPassword });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }


    await Otp.deleteOne({ email: normalizedEmail });

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});
app.use('/eventuploads', express.static(path.join(__dirname, 'eventuploads')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
