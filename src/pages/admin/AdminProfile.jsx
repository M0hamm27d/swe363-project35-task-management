import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import "../public/UserSignup.css";
import "../user/Profile.css";

const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function AdminProfile() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmChanges = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setShowConfirm(true);
  };

  const finalizeChanges = () => {
    // In a real app, we'd call an API here
    navigate("/admin-login");
  };

  const finalizeLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);
    setTimeout(() => {
      navigate("/admin-login");
    }, 2500);
  };

  return (
    <div className="profile-page">
      <div className="signup-card">
        <header className="signup-header">
          <div className="user-icon-wrapper"><UserIcon /></div>
          <Logo size="medium" isPrivacyMode={(passFocused && !showPass) || (confirmFocused && !showConfirmPass)} />
          <h2 className="welcome-msg">Edit Profile</h2>
        </header>

        <form className="signup-form" onSubmit={handleConfirmChanges}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Change Email Address</label>
            <input id="email" type="email" className="signup-input" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Change Password</label>
            <div className="input-field-wrapper">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="signup-input"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
              />
              <button type="button" className="eye-toggle-btn" onClick={() => setShowPass(!showPass)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPass ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-field-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                className="signup-input"
                placeholder="Repeat new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <button type="button" className="eye-toggle-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showConfirmPass ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <div className="profile-actions">
            <button type="submit" className="signup-btn-primary">Confirm Changes</button>
            <button type="button" className="logout-btn-secondary" onClick={handleLogout}>Log Out</button>
          </div>
        </form>
      </div>

      {showConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-card">
            <h3>Confirm Profile Changes</h3>
            <p>Are you sure you want to change your info? This will log you out automatically to apply the updates.</p>
            <div className="modal-buttons">
              <button className="confirm-yes" onClick={finalizeChanges}>Yes, Update & Logout</button>
              <button className="confirm-no" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-card">
            <div className="modal-icon-logout">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out of your account? Any unsaved progress will be lost.</p>
            <div className="modal-buttons">
              <button className="confirm-yes confirm-logout" onClick={finalizeLogout}>Yes, Log Out</button>
              <button className="confirm-no" onClick={() => setShowLogoutConfirm(false)}>Stay Signed In</button>
            </div>
          </div>
        </div>
      )}

      {isLoggingOut && (
        <div className="logout-transition-overlay">
          <div className="logout-center-content">
            <Logo size="xl" isClosing={true} />
            <p className="logout-msg">See you soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;
