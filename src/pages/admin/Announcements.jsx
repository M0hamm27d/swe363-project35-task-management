import { useState } from "react";

function Announcements() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState([
    { title: "System Maintenance", text: "There is an update tonight." },
    { title: "New Feature", text: "Task colors were improved." },
  ]);

  const saveAnnouncement = () => {
    if (!title || !text) return;
    setItems([{ title, text }, ...items]);
    setTitle("");
    setText("");
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Announcements</h1>

      <section className="admin-panel">
        <h2 className="admin-section-heading">Previous announcements</h2>
        <div className="admin-card-list">
          {items.map((item, index) => (
            <div key={index} className="admin-card-list-item">
              <div className="admin-card-list-item-title">{item.title}</div>
              <div className="admin-card-list-item-text">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <h2 className="admin-section-heading">Create new announcement</h2>
        <div className="admin-form-grid admin-form-grid--single">
          <input
            type="text"
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="admin-input"
          />
          <textarea
            placeholder="Announcement text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="admin-textarea"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <button onClick={saveAnnouncement} className="admin-btn admin-btn--primary">
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}

export default Announcements;
