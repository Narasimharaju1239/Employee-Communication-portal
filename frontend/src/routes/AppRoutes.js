import { Routes, Route } from "react-router-dom";
import AdminHome from "../admin/AdminHome";
import EmployeeHome from "../employee/EmployeeHome";
import SuperAdminHome from "../superadmin/SuperAdminHome";
import SuperAdminTasksPage from "../superadmin/components/SuperAdminTasksPage";
import AdminTasksPage from "../admin/components/AdminTasksPage";
import EmployeeTasksPage from "../employee/components/EmployeeTasksPage";
import SuperAdminLayout from "../superadmin/SuperAdminLayout";
import ChangePassword from "../pages/ChangePassword";
import ProfilePage from "../pages/ProfilePage";


const AppRoutes = () => (
  <Routes>
    <Route path="/admin/*" element={<AdminHome />}> 
      <Route path="tasks" element={<AdminTasksPage />} />
      <Route path="change-password" element={<ChangePassword />} />
      <Route path="profile" element={<ProfilePage />} />
      {/* add other nested admin routes here if needed */}
      {/* <Route path="view-issues" element={require('../admin/components/ViewIssues').default ? require('../admin/components/ViewIssues').default : null} /> */}
    </Route>
    <Route path="/employee/*" element={<EmployeeHome />}> 
      <Route path="tasks" element={<EmployeeTasksPage />} />
      <Route path="change-password" element={<ChangePassword />} />
      <Route path="profile" element={<ProfilePage />} />
      {/* <Route path="raise-issue" element={require('../employee/components/RaiseIssue').default ? require('../employee/components/RaiseIssue').default : null} /> */}
      {/* <Route path="my-issues" element={require('../employee/components/MyIssues').default ? require('../employee/components/MyIssues').default : null} /> */}
      {/* add other nested employee routes here if needed */}
    </Route>
    {/* NESTED ROUTES for super-admin */}
    <Route path="/super-admin/*" element={<SuperAdminLayout />}> 
      <Route path="tasks" element={<SuperAdminTasksPage />} />
      <Route path="profile" element={<ProfilePage />} />
      {/* add other nested routes here if needed */}
      {/* <Route path="all-issues" element={require('../superadmin/components/AllIssues').default ? require('../superadmin/components/AllIssues').default : null} /> */}
    </Route>
    {/* fallback 404 route */}
    <Route path="*" element={<div style={{padding: 32, fontSize: 24}}>404 Page Not Found</div>} />
  </Routes>
);

export default AppRoutes;
