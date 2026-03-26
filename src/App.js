import { BrowserRouter, Routes, Route } from "react-router-dom";

//Public pages
import LandingPage from "./pages/public/LandingPage";
import UserLogin from "./pages/public/UserLogin";
import UserSignup from "./pages/public/UserSignup";
import AdminLogin from "./pages/public/AdminLogin";

//User pages
import MyTasks from "./pages/user/MyTasks";
import WorkspaceTasks from "./pages/user/WorkspaceTasks";
import Calendar from "./pages/user/Calendar";
import Profile from "./pages/user/Profile";
import UserLayout from "./layouts/UserLayout";

//Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Announcements from "./pages/admin/Announcements";
import AdminProfile from "./pages/admin/AdminProfile";
import GlobalSettings from "./pages/admin/GlobalSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public default route*/}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* USER LAYOUT */}
        <Route path="/" element={<UserLayout />}>
        <Route path="my-tasks" element={<MyTasks />} />
        <Route path="workspace" element={<WorkspaceTasks />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/settings" element={<GlobalSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;