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

  const getBarColor = (value) => {
    if (value === "20%") return "#f39c12";
    if (value === "50%") return "#f1c40f";
    return "#25c23b";
  };

  return (
    <div>
      <h1 style={{ fontSize: "38px", marginTop: "6px", marginBottom: "40px" }}>
        User Management
      </h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={inputStyle}
        />
        <select
          value={newUser.workAs}
          onChange={(e) => setNewUser({ ...newUser, workAs: e.target.value })}
          style={inputStyle}
        >
          <option>Regular user</option>
          <option>Team leader</option>
          <option>Admin</option>
        </select>
        <button onClick={addUser} style={blueBtn}>
          ADD USER
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, width: "170px", marginBottom: 0 }}
        />
        <button style={blueBtn}>ADD USER</button>
        <button style={grayBtn}>EXPORT</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd", height: "48px" }}>
              <th style={thStyle}></th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>E-MAIL</th>
              <th style={thStyle}>DATA OF LOG IN</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>WORK AS</th>
              <th style={thStyle}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee", height: "62px" }}>
                <td style={tdStyle}>
                  <input type="checkbox" />
                </td>
                <td style={tdStyle}>{user.name}</td>
                <td style={{ ...tdStyle, color: "#6495ed" }}>{user.email}</td>
                <td style={tdStyle}>{user.date}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "58px",
                        height: "4px",
                        background: "#ddd",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: user.status,
                          height: "4px",
                          background: getBarColor(user.status),
                          borderRadius: "4px",
                        }}
                      ></div>
                    </div>
                    {user.status}
                  </div>
                </td>
                <td style={tdStyle}>{user.id}</td>
                <td style={tdStyle}>{user.workAs}</td>
                <td style={tdStyle}>
                  <button onClick={() => toggleBan(user.id)} style={user.banned ? unbanBtn : banBtn}>
                    {user.banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  outline: "none",
  background: "#fff",
};

const blueBtn = {
  padding: "10px 16px",
  background: "#2f80ed",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const grayBtn = {
  padding: "10px 16px",
  background: "#f2f2f2",
  color: "#666",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
};

const banBtn = {
  padding: "7px 14px",
  background: "#ffe2e2",
  color: "#d64545",
  border: "1px solid #f2b7b7",
  borderRadius: "6px",
  cursor: "pointer",
};

const unbanBtn = {
  padding: "7px 14px",
  background: "#e2ffe7",
  color: "#1d8b37",
  border: "1px solid #9fe5b0",
  borderRadius: "6px",
  cursor: "pointer",
};

const thStyle = {
  fontSize: "12px",
  color: "#666",
  textAlign: "left",
  padding: "12px 14px",
};

const tdStyle = {
  fontSize: "14px",
  color: "#333",
  padding: "12px 14px",
};

export default UserManagement;
