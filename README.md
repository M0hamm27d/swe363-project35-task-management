# 👁️ UrgenSee | Smart Task Management

> **Master your task density and optimize your schedule with smart urgency indicators.**

UrgenSee is a full-stack, enterprise-ready task management system. By focusing on **Task Density** and **Smart Urgency**, we help teams visualize their most critical work at a glance through a premium interactive experience.

---

## 🔗 Live Application
*   **Frontend (UI):** [https://swe363-project35-task-management.vercel.app](https://swe363-project35-task-management.vercel.app)
*   **Backend (API):** [https://urgensee-api.onrender.com](https://urgensee-api.onrender.com)

---

## ✨ Features that WOW

-   **🧠 Smart Eye Tracking**: Custom SVG eye engine reacts to cursor movement globally.
-   **🔐 Privacy-First UI**: Password fields trigger "Privacy Mode," causing the eyes to look away.
-   **📊 Task Density Heatmap**: Mathematical urgency indicators based on time-overlap and deadlines.
-   **🏢 Workspace Ecosystem**: Role-based access control (Admin > Team Leader > User).
-   **📅 Fluid Calendar**: Dynamic scheduling with row expansion for overlapping tasks.
-   **🔒 Secure NFRs**: Enforced password complexity (8+ chars, Uppercase, Number, Special Char).

---

## 🛠️ Full-Stack Technology Stack

### **Frontend**
- **Framework**: React 18+ (Hooks, Context API, Router)
- **Styling**: Pure Vanilla CSS (Premium Design System)
- **Visuals**: Native JavaScript SVG Manipulation

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Security**: JWT (JSON Web Tokens), Bcrypt.js hashing

---

## 🏗️ Project Architecture

```text
swe363-project35-task-management/
├── server/              # Backend Root
│   ├── controllers/     # Business logic (Auth, Tasks, Admin)
│   ├── models/          # MongoDB Schemas (User, Task, Workspace)
│   ├── routes/          # API Endpoint definitions
│   ├── utils/           # Shared validators & logic
│   └── server.js        # Server Entry Point
├── src/                 # Frontend Root
│   ├── components/      # UI components (Logo, TaskCard, Tags)
│   ├── context/         # Global State management
│   ├── layouts/         # Page templates
│   ├── pages/           # Admin, User, and Public views
│   └── utils/           # API interceptors & urgency calculators
└── README.md
```
---

## ⚙️ The Backend Engine (MVC Pattern)

To ensure the app is modular, scalable, and easy to test, we implemented a decoupled **MVC-style architecture**:

*   **🛣️ Routes**: Acts as the "Traffic Controller." It defines the API entry points and delegates requests to the appropriate controllers.
*   **🧠 Controllers**: The "Logic Core." This is where the CRUD operations (Create, Read, Update, Delete) are managed, data is saved to MongoDB, and session-specific responses are formatted.
*   **🛡️ Middleware**: The "Security Layer."
    *   `authMiddleware.js`: Intercepts requests to private routes to verify JWT tokens.
    *   `adminMiddleware.js`: Ensures only users with the `admin` role can access management features.
*   **🗄️ Models**: The "Data Blueprints." Using Mongoose, we define strict schemas for Users, Tasks, and Workspaces to ensure data integrity.

---

## 🗄️ Cloud Database: MongoDB Atlas

Our application uses **MongoDB Atlas** as its production-grade cloud database. To ensure the live backend on Render can communicate with the database, we performed the following configurations:

1.  **Cluster Setup**: Provisioned a shared cluster on AWS.
2.  **Network Security**: Configured the **IP Access List** to `0.0.0.0/0` (Allow Access from Anywhere). This is essential for cloud deployments (like Render) where the server IP can change dynamically.
3.  **Database User**: Created a dedicated user with `readWrite` permissions to the `taskmanagement` database.
4.  **Connection String**: Integrated the URI into the backend via the `MONGODB_URI` environment variable, ensuring the database credentials are never exposed in the source code.

---

## 🚀 Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/M0hamm27d/swe363-project35-task-management.git
```

### **2. Backend Configuration**
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   ```
4. Start the server: `npm start`

### **3. Frontend Configuration**
1. Navigate to the root folder.
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```
4. Start the React app: `npm start`

---

## 📡 API Documentation

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user (with NFR check) | Public |
| **POST** | `/api/auth/login` | Authenticate user & get Token | Public |
| **GET** | `/api/tasks` | Get all tasks for current user | Private |
| **POST** | `/api/tasks` | Create a new task | Private |
| **GET** | `/api/admin/stats` | System-wide usage analytics | Admin Only |
| **PUT** | `/api/admin/users/:id/ban` | Toggle user access | Admin Only |
| **GET** | `/api/workspaces` | Fetch active team workspaces | Private |

> **Note:** This table highlights the core functional routes. The application includes several other specialized API endpoints (Tag management, Workspace Invites, Profile updates, etc.) that can be reviewed in the backend route files or tested directly through the live UI.


### **Request/Response Examples**

#### **1. User Registration**
*   **Endpoint:** `POST /api/auth/register`
*   **Request Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "Password123!" 
    }
    ```
*   **Success Response (201):**
    ```json
    {
      "_id": "69f60c12130549a38890ff8f",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjYwYzEyMTMwNTQ5YTM4ODkwZmY4ZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3NzMyNjI2LCJleHAiOjE3ODAzMjQ2MjZ9.j_TjhJCvR0JcUSakrjUxiCN4lwzpdCjlQr71pzw7D7U"
    }
    ```

#### **2. Create Task**
*   **Endpoint:** `POST /api/tasks`
*   **Request Body:**
    ```json
    {
      "title": "Final Project Submission",
      "startDate": "2026-05-01T08:00:00Z",
      "deadline": "2026-05-15T23:59:00Z",
      "estimatedFinish": {
        "days": 0,
        "hours": 12,
        "minutes": 0
      }
    }
    ```
*   **Success Response (201):**
    ```json
    {
        "title": "Final Project Submission",
        "progress": 0,
        "completed": false,
        "estimatedFinish": {
            "days": 0,
            "hours": 12,
            "minutes": 0
        },
        "isVisible": true,
        "startDate": "2026-05-01T08:00:00.000Z",
        "deadline": "2026-05-15T23:59:00.000Z",
        "userId": "69f60c12130549a38890ff8f",
        "workspaceId": null,
        "_id": "69f60cb4130549a38890ff90",
        "createdAt": "2026-05-02T14:39:48.534Z",
        "updatedAt": "2026-05-02T14:39:48.534Z",
        "__v": 0
    }
    ```

### **🛠️ Testing with Postman**
To test the private endpoints (Tasks, Admin, etc.) using Postman or cURL, follow these steps:
1.  **Get a Token**: Perform a `POST` request to `/api/auth/login` or `/api/auth/register`.
2.  **Copy the Token**: From the JSON response, copy the `token` string.
3.  **Authorize in Postman**:
    *   In Postman, go to the **Authorization** tab.
    *   Select **Type**: `Bearer Token`.
    *   **Token**: Paste the token you copied.
4.  **Send Request**: You can now access protected routes like `GET /api/tasks`.

---

## 👥 Meet Team G35

| Member | Role & Contributions | GitHub |
| :--- | :--- | :--- |
| **Mohammed Alrashid** | Full-Stack Integration, Urgency Logic, Database Design | [@M0hamm27d](https://github.com/M0hamm27d) |
| **Omar Alshehri** | Admin UI Foundation & Core Layouts | [@OmarAlshehri0](https://github.com/OmarAlshehri0) |
| **Mohammed Alzaid** | Admin UX Logic & Statistics UI | [@suleiman-MBS](https://github.com/suleiman-MBS) |
| **Elyas Elamri** | Testing, System Review, and Documentation | [@elyalam](https://github.com/elyalam) |

---

## 🛡️ Best Practices & Security
- **JWT Authentication**: We use a stateless authentication system. **All routes are private** (require a Bearer Token) except for `/api/auth/register` and `/api/auth/login`.
- **Data Validation**: Strict input validation for passwords (NFR) and email formats.
- **Environmental Safety**: Sensitive credentials are never pushed to Git (managed via `.env`).
- **RESTful Principles**: Clean separation of concerns between models, routes, and controllers.
