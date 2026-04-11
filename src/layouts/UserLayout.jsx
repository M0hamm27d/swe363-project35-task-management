import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import "./UserLayout.css";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const Icons = {
  tasks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  workspace: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const navItems = [
  { to: "/my-tasks", label: "My Tasks", icon: Icons.tasks },
  { to: "/workspace", label: "Workspace", icon: Icons.workspace },
  { to: "/calendar", label: "Calendar", icon: Icons.calendar },
];

function UserLayout() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "U";
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="user-layout">
      {!sidebarOpen && (
        <button
          id="hamburger-btn"
          className="hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          {Icons.menu}
        </button>
      )}

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />}

      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close navigation menu">
          {Icons.close}
        </button>

        <div className="sidebar-brand">
          <Logo size="small" isStatic={location.pathname === "/profile"} />
        </div>

        <Link to="/profile" className="avatar-link" onClick={closeSidebar}>
          <div className="avatar-circle" aria-label="Go to profile">{userInitial}</div>
        </Link>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${location.pathname === item.to ? "nav-item--active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}

export default UserLayout;