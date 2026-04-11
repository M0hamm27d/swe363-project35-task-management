import React from 'react';
import './Footer.css';

const SocialIcons = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16H20L8.267 4z" />
      <path d="M4 20l6.768-6.768m2.464-2.464L20 4" />
    </svg>
  )
};

function Footer() {
  return (
    <footer className="user-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-title">Contact Us</h4>
          <div className="footer-info">
            <div className="footer-item">
              <span className="footer-label">Email:</span>
              <a href="mailto:Group35@kfupm.edu.sa" className="footer-link">Group35@kfupm.edu.sa</a>
            </div>
            <div className="footer-item">
              <span className="footer-label">Number:</span>
              <span className="footer-text">+966 50 234 5678</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-title">Follow Us</h4>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              {SocialIcons.LinkedIn}
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              {SocialIcons.Instagram}
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X">
              {SocialIcons.X}
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} UrgenSee Team. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
