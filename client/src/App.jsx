// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from './Student/Dashboard';
import Events from './Student/Events';
import MonthlyStats from './Student/MonthlyStats';
import OdApply from './Student/OdApply';
import Odresponse from './Student/Odresponse';
import Response from './Student/Response';
import TeacherDashboard from './TeachersPart/Profile';
import Addup from './TeachersPart/Addup';
import Od from './TeachersPart/Od';
import Profile from './TeachersPart/Profile';
import Stats from './TeachersPart/Stats';
import CoordinatorDashBoard from './EventCoordinator/Dashboard';
import EventAddingForm from './EventCoordinator/EventAddingForm';
import Signin from './Signin/Signin';
import OdApplied from './TeachersPart/OdApplied'   ;
import OdResponse from './TeachersPart/Odresponse';
import Odclimed from './TeachersPart/Odclimed';
import TeacherEvents from './TeachersPart/TeacherEvents';
import ForgotPassword from './Signin/OtpRequest';
import PasswordReset from './Signin/PasswordReset';


function App() {
  return (
    <div>
   <div className="absolute inset-0 -z-10 min-h-screen w-full bg-white bg-cover bg-center bg-fixed [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
   <Router>
      <Routes>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/stats" element={<MonthlyStats />} />
        <Route path="/student/events" element={<Events />} />
        <Route path="/student/apply-od" element={<OdApply />} />
        <Route path="/student/od-response" element={<Odresponse />} />
        <Route path="/student/response" element={<Response />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/addup" element={<Addup />} />
        <Route path="/teacher/stats" element={<Stats />} />
        <Route path="/teacher/od" element={<Od />} />
        <Route path="/teacher/events" element={<TeacherEvents />} />
        <Route path="/teacher/profile" element={<Profile />} />
        <Route path="/eventCoordinator/dashboard" element={<CoordinatorDashBoard />} />
        <Route path="/eventCoordinator/eventform" element={<EventAddingForm />} />
        <Route path="/" element={<Signin />} />
        <Route path="/teacher/odapply" element={<OdApplied />} />
        <Route path="/teacher/odresponse" element={<OdResponse />} />
        <Route path="/teacher/odclaimed" element={<Odclimed />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />


        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
