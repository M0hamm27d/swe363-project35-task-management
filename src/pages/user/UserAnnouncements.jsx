import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './UserAnnouncements.css';

function UserAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get('/system/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching all announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="user-announcements-page">
      <header className="page-header">
        <h1 className="page-title">System Announcements</h1>
        <p className="page-subtitle">Stay up to date with the latest platform updates and news.</p>
      </header>

      <div className="announcements-list">
        {isLoading ? (
          <div className="loading-state">Loading updates...</div>
        ) : announcements.length > 0 ? (
          announcements.map((item) => (
            <div key={item._id} className="announcement-item">
              <div className="item-date">
                {new Date(item.createdAt).toLocaleDateString(undefined, { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <h2 className="item-title">{item.title}</h2>
              <p className="item-body">{item.body}</p>
            </div>
          ))
        ) : (
          <div className="empty-state">No announcements posted yet.</div>
        )}
      </div>
    </div>
  );
}

export default UserAnnouncements;
