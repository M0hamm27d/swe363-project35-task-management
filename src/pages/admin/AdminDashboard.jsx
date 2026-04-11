function AdminDashboard() {
  const bars = [
    { day: "Mo", dark: 260, light: 350 },
    { day: "Tu", dark: 220, light: 340 },
    { day: "We", dark: 320, light: 520 },
    { day: "Th", dark: 410, light: 560 },
    { day: "Fr", dark: 255, light: 390 },
    { day: "Sa", dark: 320, light: 430 },
    { day: "Su", dark: 370, light: 450 },
  ];

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-card-grid">
        <div className="admin-card">
          <span className="admin-card__label">Total Users</span>
          <span className="admin-card__value">245</span>
        </div>
        <div className="admin-card">
          <span className="admin-card__label">Active Tasks</span>
          <span className="admin-card__value">1,023</span>
        </div>
        <div className="admin-card">
          <span className="admin-card__label">System Status</span>
          <span className="admin-card__value">Online</span>
        </div>
      </div>

      <section className="admin-panel admin-chart">
        <div className="admin-chart-header">
          <h2 className="admin-chart-title">Usage</h2>
          <div className="admin-chart-legend">
            <span className="admin-chart-legend-item">
              <span className="admin-chart-dot"></span>
              <span>Daily active</span>
            </span>
            <span className="admin-chart-legend-item">
              <span className="admin-chart-dot admin-chart-dot--secondary"></span>
              <span>Projected</span>
            </span>
          </div>
        </div>

        <p className="admin-text">Hover over each bar to see daily trends and compare active usage.</p>

        <div className="admin-bar-grid">
          {bars.map((bar) => (
            <div key={bar.day} className="admin-bar-cell">
              <div className="admin-bar-track">
                <div className="admin-bar" style={{ height: `${bar.dark / 3}px` }}></div>
                <div className="admin-bar admin-bar--secondary" style={{ height: `${(bar.light - bar.dark) / 3}px` }}></div>
              </div>
              <div className="admin-bar-label">{bar.day}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
