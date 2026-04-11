import { useState } from "react";

function Announcements() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState([
    { title: "System Maintenance", text: "there is an update tonight." },
    { title: "New Feature", text: "task colors were improved" },
  ]);

  const saveAnnouncement = () => {
    if (!title || !text) return;
    setItems([{ title, text }, ...items]);
    setTitle("");
    setText("");
  };

  return (
    <div>
      <div
        style={{
          background: "#d9d9d9",
          borderRadius: "28px",
          width: "300px",
          padding: "16px 34px",
          fontSize: "34px",
          fontWeight: "700",
          marginBottom: "54px",
        }}
      >
        Announcements
      </div>

      <div
        style={{
          background: "#d9d9d9",
          borderRadius: "22px",
          width: "540px",
          maxWidth: "100%",
          padding: "18px 30px",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "28px",
        }}
      >
        previous announcements
      </div>

      <div style={{ width: "540px", maxWidth: "100%", marginBottom: "36px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontWeight: "700", marginBottom: "6px" }}>{item.title}</div>
            <div style={{ color: "#666" }}>{item.text}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#d9d9d9",
          borderRadius: "22px",
          width: "640px",
          maxWidth: "100%",
          padding: "18px 30px",
          fontSize: "28px",
          fontWeight: "700",
          marginTop: "40px",
        }}
      >
        create new announcements
      </div>

      <div
        style={{
          background: "#dfe0e8",
          width: "640px",
          maxWidth: "100%",
          padding: "20px",
          borderRadius: "20px",
          marginTop: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            marginBottom: "10px",
            fontSize: "18px",
          }}
        />

        <textarea
          placeholder="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            height: "100px",
            border: "none",
            outline: "none",
            padding: "10px",
            fontSize: "18px",
            resize: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <button
          onClick={saveAnnouncement}
          style={{
            background: "#2f80ed",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "18px 28px",
            fontSize: "22px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Announcements;
