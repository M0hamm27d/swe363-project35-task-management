import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import "./AdminLayout.css";
import "../pages/admin/AdminPages.css";

const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13h8V3H3v10z" />
      <path d="M13 21h8V11h-8v10z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  announcements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0v6a6 6 0 0 0 12 0V8z" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33" />
      <path d="M4.6 9a1.65 1.65 0 0 1-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 1 1.82.33" />
      <path d="M21 12h-2" />
      <path d="M5 12H3" />
      <path d="M16.24 7.76l-1.42-1.42" />
      <path d="M9.66 16.34l-1.42 1.42" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Icons.dashboard },
  { to: "/admin/users", label: "User Management", icon: Icons.users },
  { to: "/admin/announcements", label: "Announcements", icon: Icons.announcements },
  { to: "/admin/profile", label: "Profile", icon: Icons.profile },
  { to: "/admin/settings", label: "Global Settings", icon: Icons.settings },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const userInitial = "A";
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {!sidebarOpen && (
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="Open admin navigation">
          {Icons.menu}
        </button>
      )}

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />}

      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <button className="admin-sidebar-close-btn" onClick={closeSidebar} aria-label="Close navigation">
          {Icons.close}
        </button>

        <div className="admin-sidebar-brand">
          <Logo size="small" isStatic={location.pathname === "/admin/profile"} />
        </div>

        <Link to="/admin/profile" className="admin-avatar-link" onClick={closeSidebar}>
          <div className="admin-avatar-circle" aria-label="Go to profile">{userInitial}</div>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-item ${location.pathname === item.to ? "admin-nav-item--active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="admin-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main-content">
        <div className="admin-content">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default AdminLayout;
