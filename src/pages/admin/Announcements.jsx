import { useState, useEffect } from "react";
import api from "../../utils/api";
import "./Announcements.css";

function Announcements() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/system/announcements");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAnnouncement = async () => {
    if (!title || !body) return;
    
    try {
      if (editingId) {
        await api.put(`/admin/announcements/${editingId}`, { title, body });
      } else {
        await api.post("/admin/announcements", { title, body });
      }
      
      setTitle("");
      setBody("");
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      
      // If we were editing the one we just deleted, reset the form
      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setBody("");
      }
      
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setBody(item.body);
    document.getElementById('announcement-editor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="admin-section">
      <h1 className="admin-page-title">Announcements</h1>

      <section className="admin-panel">
        <h2 className="admin-section-heading">Active Announcements (Scroll to view)</h2>
        <div className="announcement-horizontal-list">
          {items.map((item) => (
            <div key={item._id} className="announcement-card-simple">
              <div className="announcement-card-content">
                <h3 className="announcement-card-title">{item.title}</h3>
                <p className="announcement-card-body">{item.body}</p>
                <div className="announcement-card-date">{new Date(item.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="announcement-card-actions">
                <button className="card-action-btn edit" onClick={() => handleEdit(item)}>Edit</button>
                <button className="card-action-btn delete" onClick={() => deleteAnnouncement(item._id)}>Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && !isLoading && <p className="admin-text">No announcements found.</p>}
        </div>
      </section>

      <section className="admin-panel" id="announcement-editor">
        <h2 className="admin-section-heading">
          {editingId ? "Edit Announcement" : "Create New Announcement"}
        </h2>
        <div className="admin-form-grid admin-form-grid--single">
          <div className="input-group">
            <label className="input-label">Announcement Title</label>
            <input
              type="text"
              placeholder="e.g. Server Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="admin-input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Announcement Content</label>
            <textarea
              placeholder="Write the message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="admin-textarea"
              rows="4"
            />
          </div>
        </div>
        <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '12px' }}>
          {editingId && (
            <button onClick={() => { setEditingId(null); setTitle(""); setBody(""); }} className="admin-btn admin-btn--secondary">
              Cancel
            </button>
          )}
          <button onClick={saveAnnouncement} className="admin-btn admin-btn--primary">
            {editingId ? "Save Changes" : "Post Announcement"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Announcements;
