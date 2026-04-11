# UrgenSee | Interactive Task Management

**Master your task density and optimize your schedule with smart urgency indicators.**

UrgenSee is a modern, interactive task management system built with React. It features a professional design system focused on "task density," allowing users to manage complex workflows through intuitive workspaces, dynamic calendars, and real-time urgency metrics.

---

## 🛠️ Setup and Installation

Follow these steps to get the project running locally:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/M0hamm27d/swe363-project35-task-management.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd swe363-project35-task-management
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

---

## 🚀 Usage Instructions

### 🔐 Authentication
- **User Login/Signup:** Access the main dashboard to manage your personal tasks.
- **Admin Access:** Navigate to `/admin-login` for administrative oversight.

### 📋 Workspace Management
- Create multiple workspaces for different teams or projects.
- Invite members and manage roles (Leader vs. Member).
- Use the **Workspace Board** to organize tasks by status (To Do, In Progress, Done).

### 📅 Smart Calendar
- View tasks in a dynamic week or month view.
- Tasks are color-coded by workspace for quick recognition.
- Interactive "Task Density" heatmap visualization.

### ✨ Interactive Logo
- The "UrgenSee" logo eyes will track your cursor globally.
- In sensitive fields (like passwords), the eyes will enter "Privacy Mode" and look away.

---

## 👥 Team Members and Roles

| Name | Role | GitHub |
| :--- | :--- | :--- |
| **[Mohammed Alrashid]** | [User UI/UX Creation , Logic , Theme & Logo Design] | [M0hamm27d] |
| **[Omar Alshehri]** | [Admin UI Creation] | [OmarAlshehri0] |
| **[Mohammed Alzaid]** | [Admin UI/UX enhancment & logic] | [suleiman-MBS] |
| **[Elyas Elamri]** | [Reviewer , Tester , and Documentation related] | [elyalam] |


---

## 📄 Additional Documentation

### Environment Variables
Currently, this is a front-end prototype and does not require external API keys. However, for future backend integration:
- Create a `.env` file in the root directory.
- Define variables such as `REACT_APP_API_URL`.
- **Note:** The `.env` file is excluded from version control via `.gitignore` to protect sensitive data.

---

## 📁 Repository Structure

The project follows a modular, logical structure to ensure scalability and maintainability:

```text
swe363-project35-task-management/
├── public/                 # Static assets and index.html
├── src/
│   ├── components/         # Reusable UI components (Logo, TaskCard, etc.)
│   ├── context/            # Global state management (Tasks, Workspaces)
│   ├── data/               # Mock data for prototyping
│   ├── layouts/            # Page shell layouts (Sidebar, Footer)
│   ├── pages/              # Main page views (Login, Dashboard, Calendar)
│   ├── utils/              # Helper functions and calculators
│   ├── App.js              # Root component & Routing
│   └── index.css           # Global styles and design system tokens
├── .gitignore              # Excluded files (node_modules, .env, build)
└── package.json            # Dependencies and scripts
```

---

## 🛡️ Best Practices
- **Clean History:** Atomic commits that group related changes logically.
- **Privacy:** Sensitive information and build artifacts are excluded using a comprehensive `.gitignore`.
- **Responsive Design:** Optimized for both desktop and mobile viewports.
