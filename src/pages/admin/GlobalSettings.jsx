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
    <div className="admin-section">
      <h1 className="admin-page-title">Global Settings</h1>

      <div className="admin-panel admin-form-grid">
        <div className="admin-field-group">
          <h2 className="admin-section-heading">Follow Us</h2>
          <div className="admin-field-group">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "28px", minWidth: "36px", textAlign: "center" }}>𝕏</span>
              <input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="admin-input"
                placeholder="Twitter URL"
              />
            </div>
          </div>
          <div className="admin-field-group">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "28px", minWidth: "36px", textAlign: "center" }}>◎</span>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="admin-input"
                placeholder="Instagram URL"
              />
            </div>
          </div>
          <div className="admin-field-group">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "28px", minWidth: "36px", textAlign: "center" }}>in</span>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="admin-input"
                placeholder="LinkedIn URL"
              />
            </div>
          </div>
        </div>

        <div className="admin-field-group">
          <h2 className="admin-section-heading">Contact Us</h2>
          <div className="admin-field-group">
            <label className="admin-text" htmlFor="contact-number">
              Number
            </label>
            <input
              id="contact-number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="admin-input"
            />
          </div>
          <div className="admin-field-group">
            <label className="admin-text" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
            />
          </div>
        </div>
      </div>

      <button onClick={saveSettings} className="admin-btn admin-btn--primary">
        Save Changes
      </button>
    </div>
  );
}

export default GlobalSettings;
