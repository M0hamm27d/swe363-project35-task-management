import { useState, useEffect } from "react";
import api from "../../utils/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    systemStatus: "Loading...",
    usageMetrics: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setStats(prev => ({ ...prev, systemStatus: "Error" }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-card-grid">
        <div className="admin-card">
          <span className="admin-card__label">Total Users</span>
          <span className="admin-card__value">{stats.totalUsers.toLocaleString()}</span>
        </div>
        <div className="admin-card">
          <span className="admin-card__label">Active Tasks</span>
          <span className="admin-card__value">{stats.activeTasks.toLocaleString()}</span>
        </div>
        <div className="admin-card">
          <span className="admin-card__label">System Status</span>
          <span className={`admin-card__value ${stats.systemStatus === 'Maintenance' ? 'admin-card__value--warning' : 'admin-card__value--success'}`}>
            {stats.systemStatus}
          </span>
        </div>
      </div>

      <section className="admin-panel admin-chart">
        <div className="admin-chart-header">
          <h2 className="admin-chart-title">Usage</h2>
          <div className="admin-chart-legend">
            <span className="admin-chart-legend-item">
              <span className="admin-chart-dot"></span>
              <span>Active Users (Real-time)</span>
            </span>
            <span className="admin-chart-legend-item">
              <span className="admin-chart-dot admin-chart-dot--secondary"></span>
              <span>Total Registered Users</span>
            </span>
          </div>
        </div>

        <p className="admin-text">Hover over each bar to see unique daily logins compared to your total user base.</p>

        <div className="admin-bar-grid">
          {stats.usageMetrics && stats.usageMetrics.length > 0 ? stats.usageMetrics.map((bar) => {
            const activeHeight = (bar.active / bar.total) * 180;
            const percentage = Math.round((bar.active / bar.total) * 100);

            return (
              <div 
                key={bar.day} 
                className="admin-bar-cell" 
                title={`${percentage}% of total users were active (${bar.active}/${bar.total})`}
              >
                <div className="admin-bar-track">
                  {/* The active (blue) liquid bar */}
                  <div className="admin-bar" style={{ height: `${activeHeight}px` }}>
                    {percentage > 5 && <span className="admin-bar-percent">{percentage}%</span>}
                  </div>
                </div>
                <div className="admin-bar-label">{bar.day}</div>
              </div>
            );
          }) : <p style={{ color: '#7090c0', fontSize: 14 }}>Loading chart data...</p>}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
