import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './NotificationBanner.css';

const NotificationBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchLatestAnnouncement = async () => {
      try {
        const response = await api.get('/system/announcements');
        if (response.data && response.data.length > 0) {
          const latest = response.data[0]; // Get the newest one
          
          // Check if user has already dismissed THIS specific announcement
          const dismissedId = localStorage.getItem('dismissed_announcement_id');
          if (dismissedId !== latest._id) {
            setAnnouncement(latest);
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchLatestAnnouncement();
  }, []);

  const handleDismiss = () => {
    if (announcement) {
      localStorage.setItem('dismissed_announcement_id', announcement._id);
      setIsVisible(false);
    }
  };

  if (!isVisible || !announcement) return null;

  return (
    <div className="notification-banner">
      <div className="banner-content">
        <div className="banner-tag">Announcement</div>
        <div className="banner-text">
          <span className="banner-title">{announcement.title}:</span> {announcement.body}
        </div>
      </div>
      <button className="banner-close" onClick={handleDismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
};

export default NotificationBanner;
