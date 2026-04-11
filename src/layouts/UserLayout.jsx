import { Link, Outlet } from "react-router-dom";

function UserLayout() {
  return ( 
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "220px", background: "#222", color: "#fff", padding: "20px" }}>
        <h3>User</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/my-tasks" style={{ color: "#fff" }}>My Tasks</Link></li>
          <li><Link to="/workspace" style={{ color: "#fff" }}>Workspace</Link></li>
          <li><Link to="/calendar" style={{ color: "#fff" }}>Calendar</Link></li>
          <li><Link to="/profile" style={{ color: "#fff" }}>Profile</Link></li>
        </ul>
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;