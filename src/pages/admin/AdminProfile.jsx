import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    alert("Profile updated");
  };

  const handleLogout = () => {

    navigate("/admin-login");
  };




  return (
    <div style={{ minHeight: "calc(100vh - 56px)", position: "relative" }}>
      <div
        style={{
          width: "280px",
          height: "220px",
          background: "#d8dce3",
          borderRadius: "52% 48% 45% 55% / 45% 45% 55% 55%",

          margin: "0 auto 40px auto",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            border: "2px solid #333",
            borderRadius: "50%",
            position: "absolute",
            top: "28px",
            left: "50%",

            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              border: "2px solid #333",

              borderRadius: "50%",
              position: "absolute",
              top: "26px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          ></div>
          <div
            style={{
              width: "88px",
              height: "42px",
              border: "2px solid #333",
              borderTopLeftRadius: "60px",

              borderTopRightRadius: "60px",
              borderBottom: "none",
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          ></div>
        </div>
      </div>

      <div style={{ width: "440px", margin: "0 auto" }}>
        <div style={{ fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>
          Change Email
        </div>


        <input
          type="email"
          placeholder="Eenter your new email"


          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={fieldStyle}
        />
        <div style={{ fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>
          Change Password
        </div>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={fieldStyle}
        />
      </div>

      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          left: "40px",
          bottom: "30px",
          width: "170px",
          padding: "14px 16px",
          borderRadius: "6px",

          background: "#fff",
          border: "1px solid #333",
          color: "red",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Log Out
      </button>

      <button
        onClick={handleConfirm}
        style={{
          position: "absolute",
          right: "20px",
          bottom: "30px",


          width: "160px",
          padding: "14px 16px",
          borderRadius: "6px",
          background: "#fff",
          border: "1px solid #333",
          color: "#111",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Confirm
      </button>
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  marginBottom: "20px",
  padding: "16px",
  background: "#ececf3",
  border: "none",
  outline: "none",
  fontSize: "16px",
};

export default AdminProfile;
