import { Link, Outlet, useLocation } from "react-router-dom";

function AdminLayout() {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#2f80ed" : "#111",
    textDecoration: "none",
    fontSize: "16px",
    display: "block",
    marginBottom: "26px",
  });

  const iconStyle = {
    width: "18px",
    height: "18px",
    border: "2px dashed #2f80ed",
    borderRadius: "4px",
    marginRight: "14px",
    flexShrink: 0,
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
  };

  const pageTitle =
    location.pathname === "/admin"
      ? "Dashboard"
      : location.pathname === "/admin/users"
      ? "User Management"
      : location.pathname === "/admin/announcements"
      ? "Announcements"
      : location.pathname === "/admin/profile"
      ? "Profile"
      : "Global Settings";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f3f3" }}>
      <aside
        style={{
          width: "290px",
          background: "#f5f5f5",
          borderRight: "1px solid #d9d9d9",
          padding: "34px 22px",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "14px",
            border: "2px solid #2f80ed",
            borderRadius: "3px",
            marginBottom: "42px",
          }}
        />

        <h1 style={{ fontSize: "34px", margin: "0 0 26px 0", fontWeight: "700" }}>
          {pageTitle}
        </h1>

        <div style={rowStyle}>
          <div style={iconStyle}></div>
          <Link to="/admin" style={linkStyle("/admin")}>
            Dashboard
          </Link>
        </div>

        <div style={rowStyle}>
          <div style={iconStyle}></div>
          <Link to="/admin/users" style={linkStyle("/admin/users")}>
            User Management
          </Link>
        </div>

        <div style={rowStyle}>
          <div style={iconStyle}></div>
          <Link to="/admin/announcements" style={linkStyle("/admin/announcements")}>
            Announcement
          </Link>
        </div>

        <div style={rowStyle}>
          <div style={iconStyle}></div>
          <Link to="/admin/profile" style={linkStyle("/admin/profile")}>
            Profile
          </Link>
        </div>

        <div style={rowStyle}>
          <div style={iconStyle}></div>
          <Link to="/admin/settings" style={linkStyle("/admin/settings")}>
            Global Settings
          </Link>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <main style={{ flex: 1, padding: "28px 22px" }}>
          <Outlet />
        </main>

        <footer
          style={{
            background: "#020d2b",
            color: "#fff",
            padding: "30px 70px 12px 70px",
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "40px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "28px",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 14px 0", fontSize: "18px" }}>Contact Us</h3>
              <div style={{ marginBottom: "10px", color: "#c8d0df" }}>
                <strong style={{ color: "#fff", marginRight: "10px" }}>Email:</strong>
                Group35@kfupm.edu.sa
              </div>
              <div style={{ color: "#c8d0df" }}>
                <strong style={{ color: "#fff", marginRight: "10px" }}>Number:</strong>
                +966 50 234 5678
              </div>
            </div>

            <div>
              <h3 style={{ margin: "0 0 14px 0", fontSize: "18px" }}>Follow Us</h3>
              <div style={{ display: "flex", gap: "18px", fontSize: "36px", color: "#aeb9cd" }}>
                <span>in</span>
                <span>◎</span>
                <span>𝕏</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", color: "#6e7890", paddingTop: "18px", fontSize: "14px" }}>
            © 2026 UrgenSee Team. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;