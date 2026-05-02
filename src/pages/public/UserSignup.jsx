import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Logo from '../../components/Logo';
import './UserSignup.css';

// ─── Component SVGs ────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function UserSignup() {
  const navigate = useNavigate();
  const { register } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = (pass) => {
    return pass.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

  const { firstName, lastName, email, password, confirmPassword } = formData;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    setError('Please fill in all fields.');
    return;
  }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

    const result = await register({ firstName, lastName, email, password }, false);
    
    if (result.success) {
      navigate('/my-tasks');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* Back Arrow - Linked to the card box border */}
        <Link to="/" className="back-arrow-btn" aria-label="Back to landing page">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>

        <header className="signup-header">
          <div className="user-icon-wrapper"><UserIcon /></div>
          <Logo size="medium" isPrivacyMode={(passFocused && !showPass) || (confirmFocused && !showConfirmPass)} />
          <h2 className="welcome-msg">Join UrgenSee</h2>
        </header>

        <form className="signup-form" onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="input-group">
              <label className="input-label" htmlFor="firstName">First Name</label>
              <input id="firstName" className="signup-input" placeholder="John" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="lastName">Last Name</label>
              <input id="lastName" className="signup-input" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <input id="email" type="email" className="signup-input" placeholder="john@company.com" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <div className="input-field-wrapper">
              <input 
                id="password" 
                type={showPass ? 'text' : 'password'} 
                className="signup-input" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                required 
              />
              <button type="button" className="eye-toggle-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-field-wrapper">
              <input 
                id="confirmPassword" 
                type={showConfirmPass ? 'text' : 'password'} 
                className="signup-input" 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                required 
              />
              <button type="button" className="eye-toggle-btn" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <button type="submit" className="signup-btn-primary">Create Account</button>
        </form>

        <footer className="signup-footer">
          Already have an account? 
          <Link to="/login" className="login-link">Sign in</Link>
        </footer>
      </div>
    </div>
  );
}

export default UserSignup;