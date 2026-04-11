import React, { useEffect, useRef } from 'react';
import './Logo.css';

/**
 * (Logo & Eye Assets)
 * My custom Logo component for UrgenSee.
 * I've built the 'ee' letters as interactive eycons integrated into the brand anatomy.
 */
const Logo = ({ className = '', size = 'medium', isPrivacyMode = false, isStatic = false, isClosing = false }) => {
  const logoRef = useRef(null);
  const lastMousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // (Sleepy Eye Engine)
  // (Eye Tracking Logic)
  useEffect(() => {
    // I need to freeze tracking if the eye is in static or closing mode
    if (isStatic || isClosing) return;

    const updatePupils = (mouseX, mouseY) => {
      if (!logoRef.current) return;
      const eyes = logoRef.current.querySelectorAll('.letter-eye');

      eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const deltaX = mouseX - eyeCenterX;
        const deltaY = mouseY - eyeCenterY;

        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxRadius = rect.width * 0.18;

        const limitedDistance = Math.min(distance, maxRadius);
        const pupilX = Math.cos(angle) * limitedDistance;
        const pupilY = Math.sin(angle) * limitedDistance;

        // Refined Privacy Logic: 
        // 1. Always invert X for that 'shy' avoidant feel.
        // 2. Only invert Y if the mouse is below the eye (deltaY > 0) to prevent 
        //    the eyes from looking down at the password field.
        const finalX = isPrivacyMode ? -pupilX : pupilX;
        let finalY = pupilY;

        if (isPrivacyMode) {
          if (deltaY > 0) {
            finalY = -pupilY; // Look up if mouse is below
          } else {
            finalY = pupilY; // Track normally if mouse is already above
          }
        }

        eye.style.setProperty('--pupil-x', `${finalX}px`);
        eye.style.setProperty('--pupil-y', `${finalY}px`);
      });
    };

    const handleMouseMove = (e) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      updatePupils(e.clientX, e.clientY);
    };

    // Immediate update on focus/prop change
    updatePupils(lastMousePos.current.x, lastMousePos.current.y);

    // Attaching the listener to the window so the eyes follow the mouse everywhere
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPrivacyMode, isStatic, isClosing]);

  // (Sleepy Eye Engine)
  // (Logo Rendering Logic)
  return (
    <div ref={logoRef} className={`urgensee-logo ${className} urgensee-logo--${size} ${isClosing ? 'urgensee-logo--closing' : ''}`}>
      <span className="logo-urgen">Urgen</span>
      <span className="logo-see">
        <span className="letter-s">S</span>
        <span className="letter-eye letter-eye--priority">
          <span className="eye-lashes"></span>
          <span className="eye-loop"></span>
          <span className="eye-crossbar"></span>
          <span className="eye-pupil"></span>
        </span>
        <span className="letter-eye letter-eye--safety">
          <span className="eye-lashes"></span>
          <span className="eye-loop"></span>
          <span className="eye-pupil"></span>
        </span>
      </span>
    </div>
  );
};

export default Logo;
