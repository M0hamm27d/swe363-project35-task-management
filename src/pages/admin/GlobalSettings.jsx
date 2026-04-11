import { useState } from "react";

function GlobalSettings() {
  const [twitter, setTwitter] = useState("https://x.com/taskvisualizer");
  const [instagram, setInstagram] = useState("https://instagram.com/taskvisualizer");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/company/taskvisualizer");
  const [number, setNumber] = useState("+966 500000000");
  const [email, setEmail] = useState("taskvisualizer@gmail.com");

  const saveSettings = () => {
    alert("Settings saved");
  };

  return (
    <div>
      <h1 style={{ fontSize: "34px", marginTop: "10px", marginBottom: "40px" }}>
        Global Settings
      </h1>

      <div style={{ display: "flex", gap: "140px", flexWrap: "wrap", marginBottom: "40px" }}>
        <div>
          <h2 style={{ fontSize: "30px", marginBottom: "24px" }}>Follow Us:</h2>

          <div style={iconRowStyle}>
            <span style={iconStyle}>𝕏</span>
            <input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={iconRowStyle}>
            <span style={iconStyle}>◎</span>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={iconRowStyle}>
            <span style={iconStyle}>in</span>
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "30px", marginBottom: "24px" }}>Contact Us:</h2>

          <div style={{ marginBottom: "18px" }}>
            <div style={labelStyle}>Number :</div>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={labelStyle}>Email :</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <button
        onClick={saveSettings}
        style={{
          marginTop: "28px",
          background: "#2f80ed",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "14px 24px",
          fontSize: "18px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

const iconRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  marginBottom: "18px",
};

const iconStyle = {
  fontSize: "38px",
  width: "40px",
  textAlign: "center",
  fontWeight: "700",
};

const labelStyle = {
  fontSize: "18px",
  marginBottom: "8px",
};

const inputStyle = {
  width: "320px",
  maxWidth: "100%",
  padding: "10px 12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  outline: "none",
  fontSize: "15px",
};

export default GlobalSettings;
