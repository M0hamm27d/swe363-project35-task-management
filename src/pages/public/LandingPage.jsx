import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <Logo size="xl" />
        <h2 className="welcome-text">Welcome</h2>
        
        <div className="button-group">
          <Link to="/login" className="landing-btn btn-login">Log in</Link>
          <Link to="/signup" className="landing-btn btn-signup">Sign up</Link>
        </div>

        <div className="admin-link-wrapper">
          Are you an admin? 
          <Link to="/admin-login" className="admin-link">Click here</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;