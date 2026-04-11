# 👁️ UrgenSee | Smart Task Management

> **Master your task density and optimize your schedule with smart urgency indicators.**

UrgenSee is a premium, interactive React-based task management system designed to solve the chaos of modern workflows. By focusing on **Task Density** and **Smart Urgency**, we help teams visualize their most critical work at a glance.

---

## ✨ Features that WOW

-   **🧠 Smart Eye Tracking**: Our "UrgenSee" logo eyes react to your every move, globally tracking your cursor with a playful yet functional focus.
-   **🔐 Context-Aware Privacy**: Sensitive password fields trigger "Privacy Mode," causing the logo eyes to look away—respecting your data security visually.
-   **📊 Task Density Heatmap**: Visualize your workload through color-coded status indicators (Admin Dashboard & Personal Tasks).
-   **🏢 Workspace Ecosystem**: Seamlessly transition between personal boards and team workspaces with specific leadership roles.
-   **📅 Fluid Calendar System**: A custom-built scheduling interface with dynamic row expansion and overlapping task management.

---

## 🛠️ Technology Stack

-   **Frontend**: React (Hooks, Context API, Router)
-   **Styling**: Pure Vanilla CSS (Premium Design System)
-   **Visuals**: Custom SVG Eye Engine (Native JavaScript & CSS Variables)
-   **Icons**: Hand-crafted SVG Design Iconography

---

## 🚀 Getting Started

### Prerequisites
-   **Node.js**: v16+ recommended
-   **Git**: For repository management

### Quick Setup
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/M0hamm27d/swe363-project35-task-management.git
    ```
2.  **Install Dependencies**
    ```bash
    npm install
    ```
3.  **Launch the App**
    ```bash
    npm start
    ```
    Access the interactive experience at `http://localhost:3000`.

---

## 👥 Meet Team G35

Our team focused on translating complex task management requirements into a premium interactive experience.

| Member | Role & Contributions | GitHub |
| :--- | :--- | :--- |
| **Mohammed Alrashid** | User UI/UX Creation, Logic, Theme & Logo Design | [@M0hamm27d](https://github.com/M0hamm27d) |
| **Omar Alshehri** | Admin UI Foundation & Core Layouts | [@OmarAlshehri0](https://github.com/OmarAlshehri0) |
| **Mohammed Alzaid** | Admin UI/UX Enhancement & Functional Logic | [@suleiman-MBS](https://github.com/suleiman-MBS) |
| **Elyas Elamri** | Reviewer, System Tester, and Documentation | [@elyalam](https://github.com/elyalam) |

---

## 🏗️ Project Architecture

We follow a modular directory structure designed for scalability and logical grouping:

```text
swe363-project35-task-management/
├── src/
│   ├── components/      # Standalone UI components (Logo, TaskCard, Tags)
│   ├── context/         # Centralized state (Tasks, User, Workspaces)
│   ├── data/            # Mock datasets for rapid prototyping
│   ├── layouts/         # Shared page templates (Sidebar, User View)
│   ├── pages/
│   │   ├── admin/       # Management, Dashboard, Settings
│   │   ├── public/      # Landing, Login, Signup
│   │   └── user/        # Personal Tasks, Boards, Calendar
│   ├── utils/           # Logic helpers (Density calculators, Date formatting)
│   └── index.css        # Global CSS Design System variables
└── README.md
```

---

## 🛡️ Best Practices & Security
-   **Zero Hardcoding**: All configuration is managed via external files or props.
-   **Environmental Safety**: Sensitive files like `.env` and `node_modules` are strictly excluded via `.gitignore`.
-   **Accessibility**: High-contrast dark modes and ARIA labels for interactive elements.
-   **Performance**: Optimized SVG animations for 60fps interaction.
