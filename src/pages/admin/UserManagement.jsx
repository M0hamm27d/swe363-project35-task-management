import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import "./AdminPages.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchUsers = useCallback(async (pageNum = 1, searchQuery = "") => {
    try {
      setIsLoading(true);
      const response = await api.get(`/admin/users?page=${pageNum}&limit=10&search=${searchQuery}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const toggleBan = async (id) => {
    try {
      await api.put(`/admin/users/${id}/ban`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBanned: !u.isBanned } : u));
    } catch (error) {
      console.error("Error toggling ban:", error);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete user "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
      } catch (error) {
        alert("Failed to delete user.");
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(u => u._id));
    }
  };

  const getRoleBadgeClass = (role) => {
    const r = role.toLowerCase();
    if (r === "admin") return "admin-role-badge--admin";
    if (r === "team leader") return "admin-role-badge--leader";
    return "admin-role-badge--user";
  };

  const exportUsersAsCSV = () => {
    const usersToExport = selectedIds.length > 0 
      ? users.filter(u => selectedIds.includes(u._id))
      : users;

    if (usersToExport.length === 0) {
      alert("No users to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Role", "Last Login", "Activity Status"];
    const rows = usersToExport.map(user => [
      user._id,
      user.name,
      user.email,
      user.workAs,
      user.date,
      user.isBanned ? "Banned" : "Active"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">User Management</h1>

      <div className="admin-panel">
        <div className="admin-action-bar">
          <div className="admin-search-wrapper" style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search users by name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>

          <button onClick={exportUsersAsCSV} className="admin-btn admin-btn--secondary">
            {selectedIds.length > 0 ? `Export Selected (${selectedIds.length})` : "Export Page to CSV"}
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <label className="admin-checkbox-container">
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll}
                      checked={selectedIds.length === users.length && users.length > 0}
                    />
                    <span className="admin-checkmark"></span>
                  </label>
                </th>
                <th>Name</th>
                <th>E-mail</th>
                <th>Date of log in</th>
                <th>1h Daily Goal</th>
                <th>ID</th>
                <th>Work as</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" className="admin-text" style={{ textAlign: 'center', padding: '40px' }}>Syncing with database...</td></tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className={selectedIds.includes(user._id) ? "admin-table-row--selected" : ""}>
                    <td>
                      <label className="admin-checkbox-container">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(user._id)}
                          onChange={() => toggleSelect(user._id)}
                        />
                        <span className="admin-checkmark"></span>
                      </label>
                    </td>
                    <td data-label="Name" style={{ fontWeight: 600 }}>{user.name}</td>
                    <td data-label="E-mail" style={{ color: "#4f8ef7" }}>{user.email}</td>
                    <td data-label="Date">{user.date}</td>
                    <td data-label="Goal Progress">
                      <div className="admin-status-bar">
                        <div className="admin-status-track">
                          <div
                            className="admin-status-fill"
                            style={{ 
                              width: user.status,
                              background: parseInt(user.status) > 80 ? '#4caf50' : parseInt(user.status) > 50 ? '#ff9800' : '#f44336'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{user.status}</span>
                      </div>
                    </td>
                    <td data-label="ID" style={{ fontSize: '11px', opacity: 0.7 }}>{user._id}</td>
                    <td data-label="Role">
                      <span className={`admin-role-badge ${getRoleBadgeClass(user.workAs)}`}>
                        {user.workAs}
                      </span>
                    </td>
                    <td data-label="Action">
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleBan(user._id)}
                          className={`admin-btn ${user.isBanned ? "admin-btn--secondary" : "admin-btn--danger"}`}
                          style={{ padding: '6px 12px', fontSize: '12px', marginTop: 0 }}
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="admin-btn admin-btn--danger"
                          style={{ padding: '6px 12px', fontSize: '12px', marginTop: 0, background: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="admin-text" style={{ textAlign: 'center', padding: '40px' }}>No users found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <button 
            disabled={page === 1} 
            onClick={() => fetchUsers(page - 1, search)}
            className="pagination-btn"
          >
            &laquo; Prev
          </button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => fetchUsers(page + 1, search)}
            className="pagination-btn"
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
