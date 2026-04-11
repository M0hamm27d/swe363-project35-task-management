import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkspacesProvider } from "./context/WorkspacesContext";
import { UserProvider } from "./context/UserContext";
import { TasksProvider } from "./context/TasksContext";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import UserLogin from "./pages/public/UserLogin";
import UserSignup from "./pages/public/UserSignup";
import AdminLogin from "./pages/public/AdminLogin";

// User pages
import MyTasks from "./pages/user/MyTasks";
import WorkspaceTasks from "./pages/user/WorkspaceTasks";
import WorkspaceBoard from "./pages/user/WorkspaceBoard";
import Calendar from "./pages/user/Calendar";
import Profile from "./pages/user/Profile";
import UserLayout from "./layouts/UserLayout";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Announcements from "./pages/admin/Announcements";
import AdminProfile from "./pages/admin/AdminProfile";
import GlobalSettings from "./pages/admin/GlobalSettings";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <UserProvider>
      <WorkspacesProvider>
        <TasksProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* User */}
              <Route path="/" element={<UserLayout />}>
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="workspace" element={<WorkspaceTasks />} />
                <Route path="workspace/:id" element={<WorkspaceBoard />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<GlobalSettings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TasksProvider>
      </WorkspacesProvider>
    </UserProvider>
  );
}

export default App;