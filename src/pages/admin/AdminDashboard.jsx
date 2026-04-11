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

  const cardStyle = {
    background: "#d9d9d9",
    borderRadius: "26px",
    width: "290px",
    height: "210px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "700",
  };

  return (
    <div>
      <div
        style={{
          background: "#d9d9d9",
          borderRadius: "28px",
          width: "240px",
          padding: "16px 36px",
          fontSize: "34px",
          fontWeight: "700",
          marginBottom: "62px",
        }}
      >
        Dashboard
      </div>

      <div style={{ display: "flex", gap: "18px", marginBottom: "38px", flexWrap: "wrap" }}>
        <div style={cardStyle}>Total Users: 245</div>
        <div style={cardStyle}>Active Tasks: 1,023</div>
        <div style={cardStyle}>System Status: Online</div>
      </div>

      <div
        style={{
          background: "#d9d9d9",
          borderRadius: "24px",
          width: "700px",
          maxWidth: "100%",
          padding: "28px 32px 26px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "26px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>usage</h2>
          <div style={{ fontSize: "28px", color: "#666" }}>⋮</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "#2f80ed",
              borderRadius: "12px",
              marginRight: "12px",
            }}
          ></div>
          <span style={{ fontSize: "20px", color: "#333" }}>usage</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
            height: "230px",
            padding: "0 20px 0 150px",
          }}
        >
          {bars.map((bar) => (
            <div key={bar.day} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: "24px", height: "180px", margin: "0 auto 8px" }}>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "24px",
                    height: `${bar.dark / 3}px`,
                    background: "#2f80ed",
                    borderRadius: "6px",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    bottom: `${bar.dark / 3 + 10}px`,
                    width: "24px",
                    height: `${(bar.light - bar.dark) / 3}px`,
                    background: "#9ec4f1",
                    borderRadius: "6px",
                  }}
                ></div>
              </div>
              <div style={{ color: "#555", fontSize: "22px" }}>{bar.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
