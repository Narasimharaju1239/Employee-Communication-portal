import ChangePassword from './components/ChangePassword';
import SuperAdminTasksPage from './superadmin/components/SuperAdminTasksPage';
import AdminTasksPage from './admin/components/AdminTasksPage';
import EmployeeTasksPage from './employee/components/EmployeeTasksPage';
import ProfilePage from './pages/ProfilePage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './hide-scrollbar.css';
import SuperAdminLayout from './superadmin/SuperAdminLayout';

// Super Admin
import SuperAdminHome from './superadmin/SuperAdminHome';
import ManageRoles from './superadmin/components/ManageRoles';
import ViewAllAnnouncements from './superadmin/components/ViewAllAnnouncements';
import ViewAllBookings from './superadmin/components/ViewAllBookings';
import AllIssues from './superadmin/components/AllIssues';
import ManageRooms from './superadmin/components/ManageRooms';
import SuperAdminCalendar from './superadmin/components/SuperAdminCalendar';
import CreatePollPage from './superadmin/components/CreatePollPage';
import SuperAdminDashboard from './superadmin/components/SuperAdminDashboard';
// import SystemSettings from './superadmin/components/SystemSettings';
// import SuperAdminAnalytics from "./pages/analytics/SuperAdminAnalytics";
// import SuperAdminTasksDashboard from './superadmin/components/TasksDashboard';

// Admin
import AdminHome from './admin/AdminHome';
import AdminDashboard from './admin/components/Dashboard';
import Announcements from './admin/components/Announcements';
// import AssignTasks from './admin/components/AssignTasks';
import ViewBookings from './admin/components/ViewBookings';
import Calendar from './admin/components/Calendar';
import ViewIssues from './admin/components/ViewIssues';
import AddPool from './admin/components/AddPool';
// import AdminSettingsPage from './admin/components/AdminSettingsPage';
// import AdminAnalytics from "./pages/analytics/AdminAnalytics";
// import AdminTasksDashboard from './admin/components/TasksDashboard';

// Employee
import EmployeeHome from './employee/EmployeeHome';
import EmployeeDashboard from './employee/components/Dashboard';
import EmpAnnouncements from './employee/components/Announcements';
// import Feedback from './employee/components/Feedback';
import EmpCalendar from './employee/components/Calendar';
import RaiseIssue from './employee/components/RaiseIssue';
import MyIssues from './employee/components/MyIssues';
import MyBookings from './employee/components/MyBookings';
import ViewPollsPage from './employee/components/ViewPollsPage';
// import EmployeeSettingsPage from './employee/components/EmployeeSettingsPage';
// import EmployeeAnalytics from "./pages/analytics/EmployeeAnalytics";
// import EmployeeTasksDashboard from './employee/components/TasksDashboard';

// Shared
import BookRoom from './components/BookRoom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import About from './pages/About';
import ResetPassword from './pages/ResetPassword';

// Polls
import PollList from "./components/polls/PollList";
import PollCreate from "./components/polls/PollCreate";
import PollResults from "./components/polls/PollResults";

const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <div
          className="app-scroll-area"
          style={{
            minHeight: '100vh',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Super Admin Layout for all super admin pages and change-password and profile */}
            <Route element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
              <Route path="/super-admin" element={<SuperAdminHome />} >
                <Route index element={<SuperAdminDashboard />} />
                <Route path="tasks" element={<SuperAdminTasksPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              <Route path="/super-admin/manage-roles" element={<ManageRoles />} />
              <Route path="/super-admin/book-room" element={<BookRoom roleOverride="SuperAdmin" />} />
              <Route path="/super-admin/all-announcements" element={<ViewAllAnnouncements />} />
              <Route path="/super-admin/all-bookings" element={<ViewAllBookings />} />
              <Route path="/super-admin/all-issues" element={<AllIssues />} />
              <Route path="/super-admin/manage-rooms" element={<ManageRooms />} />
              <Route path="/super-admin/calendar" element={<SuperAdminCalendar />} />
              <Route path="/super-admin/create-poll" element={<CreatePollPage />} />
              <Route path="/super-admin/change-password" element={<ChangePassword />} />
            </Route>

            {/* Poll Routes */}
            <Route path="/polls" element={<PollList />} />
            <Route path="/create-poll" element={<PollCreate />} />
            <Route path="/poll-results" element={<PollResults />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="tasks" element={<AdminTasksPage />} />
              <Route path="announcements" element={<Announcements />} />
              {/* <Route path="assign-tasks" element={<AssignTasks />} /> */}
              <Route path="book-room" element={<BookRoom roleOverride="Admin" />} />
              <Route path="view-bookings" element={<ViewBookings />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="view-issues" element={<ViewIssues />} />
              <Route path="add-pool" element={<AddPool />} />
              {/* <Route path="settings" element={<AdminSettingsPage />} /> */}
              {/* <Route path="analytics" element={<AdminAnalytics />} /> */}
              {/* <Route path="tasks" element={<AdminTasksDashboard role={currentUserRole} />} /> */}
              <Route path="profile" element={<ProfilePage />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* Employee Routes */}
            <Route path="/employee" element={<ProtectedRoute><EmployeeHome /></ProtectedRoute>}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="tasks" element={<EmployeeTasksPage />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="announcements" element={<EmpAnnouncements />} />
              <Route path="book-room" element={<BookRoom roleOverride="Employee" />} />
              <Route path="my-bookings" element={<MyBookings />} />
              {/* <Route path="feedback" element={<Feedback />} /> */}
              <Route path="calendar" element={<EmpCalendar />} />
              <Route path="raise-issue" element={<RaiseIssue />} />
              <Route path="my-issues" element={<MyIssues />} />
              <Route path="view-polls" element={<ViewPollsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="change-password" element={<ChangePassword />} />
              {/* <Route path="settings" element={<EmployeeSettingsPage />} /> */}
              {/* <Route path="analytics" element={<EmployeeAnalytics />} /> */}
              {/* <Route path="tasks" element={<EmployeeTasksDashboard role={currentUserRole} />} /> */}
            </Route>


            <Route path="*" element={<div>404 Page Not Found</div>} />

          </Routes>
        </div>
      </>
    </Router>
  );
};

export default App;
