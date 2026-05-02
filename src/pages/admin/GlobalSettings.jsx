import { useState, useEffect } from "react";
import api from "../../utils/api";
import "./AdminPages.css";

const Icons = {
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
};

function GlobalSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowUserRegistration: true,
    contactPhone: "",
    contactEmail: "",
    socialLinks: {
      twitter: "",
      instagram: "",
      linkedin: ""
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/system/settings");
      if (response.data) {
        setSettings({
          ...settings,
          ...response.data,
          socialLinks: {
            ...settings.socialLinks,
            ...response.data.socialLinks
          }
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSocialChange = (platform, value) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleContactChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    try {
      setSaveStatus("saving");
      await api.put("/admin/settings", settings);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus("error");
      console.error("Error saving settings:", error);
    }
  };

  if (isLoading) return <div className="admin-section"><p className="admin-text">Loading system configurations...</p></div>;

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Global Settings</h1>

      <section className="admin-panel">
        <h2 className="admin-section-heading">System Controls</h2>
        <div className="admin-form-grid">
          <div className="admin-toggle-card">
            <div className="toggle-info">
              <h3 className="toggle-title">Maintenance Mode</h3>
              <p className="toggle-desc">When active, only admins can access the platform.</p>
            </div>
            <label className="admin-switch">
              <input 
                type="checkbox" 
                checked={settings.maintenanceMode} 
                onChange={() => handleToggle('maintenanceMode')} 
              />
              <span className="admin-slider"></span>
            </label>
          </div>

          <div className="admin-toggle-card">
            <div className="toggle-info">
              <h3 className="toggle-title">Public Registration</h3>
              <p className="toggle-desc">Allow new users to create accounts.</p>
            </div>
            <label className="admin-switch">
              <input 
                type="checkbox" 
                checked={settings.allowUserRegistration} 
                onChange={() => handleToggle('allowUserRegistration')} 
              />
              <span className="admin-slider"></span>
            </label>
          </div>
        </div>
      </section>

      <div className="admin-panel admin-form-grid">
        <div className="admin-field-group">
          <h2 className="admin-section-heading">Social Footprint</h2>
          <div className="admin-field-group">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="social-icon-wrapper twitter">{Icons.twitter}</span>
              <input
                value={settings.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="admin-input"
                placeholder="Twitter profile URL"
              />
            </div>
          </div>
          <div className="admin-field-group">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="social-icon-wrapper instagram">{Icons.instagram}</span>
              <input
                value={settings.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="admin-input"
                placeholder="Instagram profile URL"
              />
            </div>
          </div>
          <div className="admin-field-group">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="social-icon-wrapper linkedin">{Icons.linkedin}</span>
              <input
                value={settings.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="admin-input"
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>
        </div>

        <div className="admin-field-group">
          <h2 className="admin-section-heading">Support Information</h2>
          <div className="admin-field-group">
            <label className="input-label" htmlFor="contact-number">
              Support Phone Number
            </label>
            <input
              id="contact-number"
              value={settings.contactPhone}
              onChange={(e) => handleContactChange('contactPhone', e.target.value)}
              className="admin-input"
              placeholder="+966 ..."
            />
          </div>
          <div className="admin-field-group">
            <label className="input-label" htmlFor="contact-email">
              Support Email
            </label>
            <input
              id="contact-email"
              value={settings.contactEmail}
              onChange={(e) => handleContactChange('contactEmail', e.target.value)}
              className="admin-input"
              placeholder="support@urgensee.com"
            />
          </div>
        </div>
      </div>

      <div className="admin-form-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'flex-end' }}>
        {saveStatus === "success" && <span style={{ color: '#4caf50', fontSize: '14px' }}>✓ Settings updated successfully</span>}
        {saveStatus === "error" && <span style={{ color: '#f44336', fontSize: '14px' }}>✗ Error saving settings</span>}
        <button 
          onClick={saveSettings} 
          className="admin-btn admin-btn--primary"
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? "Saving..." : "Apply Global Settings"}
        </button>
      </div>
    </div>
  );
}

export default GlobalSettings;
