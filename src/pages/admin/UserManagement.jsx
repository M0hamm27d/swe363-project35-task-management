import { useMemo, useState } from "react";

function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([
    {
      id: "202219282",
      name: "Omar Akshsss",
      email: "Omar3333@gmail.com",
      date: "17/06/2020",
      status: "75%",
      workAs: "Admin",
      banned: false,
    },
    {
      id: "202255232",
      name: "Ali Alshgwege",
      email: "Alshgwege@gmail.com",
      date: "24/11/2020",
      status: "20%",
      workAs: "Regular user",
      banned: false,
    },
    {
      id: "202219555",
      name: "Bader Bateman",
      email: "Bader20211@gmail.com",
      date: "28/03/2019",
      status: "50%",
      workAs: "Team leader",
      banned: false,
    },
    {
      id: "299919282",
      name: "Sara Maguire",
      email: "Sara3332@gmail.com",
      date: "22/01/2021",
      status: "75%",
      workAs: "Team leader",
      banned: false,
    },
    {
      id: "202219282",
      name: "Yzead Bickle",
      email: "Bickle323@gmail.com",
      date: "04/02/2021",
      status: "75%",
      workAs: "Team leader",
      banned: true,
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    workAs: "Regular user",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const roles = ["Regular user", "Team leader", "Admin"];

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const toggleBan = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, banned: !user.banned } : user
      )
    );
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;

    const item = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      date: "11/04/2026",
      status: "75%",
      workAs: newUser.workAs,
      banned: false,
    };

    setUsers((prev) => [item, ...prev]);
    setNewUser({ name: "", email: "", workAs: "Regular user" });
  };

  // Removed unused getBarColor to clean up ESLint warnings
  
  const getRoleBadgeClass = (role) => {
    const r = role.toLowerCase();
    if (r === "admin") return "admin-role-badge--admin";
    if (r === "team leader") return "admin-role-badge--leader";
    return "admin-role-badge--user";
  };

  const exportUsersAsCSV = () => {
    // Create CSV header
    const headers = ["ID", "Name", "Email", "Date of Login", "Status", "Work As", "Status"];
    
    // Create CSV rows
    const rows = filteredUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.date,
      user.status,
      user.workAs,
      user.banned ? "Banned" : "Active"
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">User Management</h1>

      <div className="admin-panel">
        <div className="admin-action-bar">
          <div className="admin-field-group">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field-group">
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="admin-input"
            />
          </div>
          <div className="admin-field-group">
            <div 
              className={`admin-custom-select ${isDropdownOpen ? 'admin-custom-select--open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="admin-custom-select__trigger">
                <span>{newUser.workAs}</span>
                <div className="admin-custom-select__chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              
              {isDropdownOpen && (
                <div className="admin-custom-select__menu">
                  {roles.map((role) => (
                    <div 
                      key={role}
                      className={`admin-custom-select__option ${newUser.workAs === role ? 'admin-custom-select__option--active' : ''}`}
                      onClick={() => {
                        setNewUser({ ...newUser, workAs: role });
                        setIsDropdownOpen(false);
                      }}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button onClick={addUser} className="admin-btn admin-btn--primary">
            Add user
          </button>
        </div>

        <div className="admin-action-bar">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
            style={{ maxWidth: 240 }}
          />
          <button onClick={exportUsersAsCSV} className="admin-btn admin-btn--secondary">
            Export to PDF
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>E-mail</th>
                <th>Date of log in</th>
                <th>Status</th>
                <th>ID</th>
                <th>Work as</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <label className="admin-checkbox-container">
                      <input type="checkbox" />
                      <span className="admin-checkmark"></span>
                    </label>
                  </td>
                  <td>{user.name}</td>
                  <td style={{ color: "#4f8ef7" }}>{user.email}</td>
                  <td>{user.date}</td>
                  <td>
                    <div className="admin-status-bar">
                      <div className="admin-status-track">
                        <div
                          className={`admin-status-fill ${
                            user.status === "20%"
                              ? "admin-status-fill--low"
                              : user.status === "50%"
                              ? "admin-status-fill--medium"
                              : "admin-status-fill--high"
                          }`}
                          style={{ width: user.status }}
                        />
                      </div>
                      <span>{user.status}</span>
                    </div>
                  </td>
                  <td>{user.id}</td>
                  <td>
                    <span className={`admin-role-badge ${getRoleBadgeClass(user.workAs)}`}>
                      {user.workAs}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleBan(user.id)}
                      className={`admin-btn ${user.banned ? "admin-btn--secondary" : "admin-btn--danger"}`}
                    >
                      {user.banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
