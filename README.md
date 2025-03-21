# 📘 Project Documentation: SQL Beyond - Hazra Imran

## 📂 Project Overview

**SQL Beyond** is an interactive gamified SQL learning platform designed to teach SQL concepts in an engaging way. Users can practice queries, receive AI-assisted hints, unlock badges, and progress through various SQL challenges. This project features a **React-based frontend** and a **Node.js & Express backend** with MongoDB as the database.

---

## 📑 Directory Structure

```
Directory structure:
└── hazraimran-sqlbeyond/
    ├── README.md
    ├── package.json
    ├── backend/
    │   ├── package backup.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── server.js
    │   ├── serverDataPush.js
    │   ├── .env
    │   ├── .gitattributes
    │   ├── .gitignore
    │   ├── routes/
    │   │   ├── game.js
    │   │   └── user.js
    │   └── utils/
    │       └── mongodb.js
    └── frontend/
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── vite.config.js
        ├── .env
        ├── .gitattributes
        ├── .gitignore
        ├── public/
        └── src/
            ├── App.jsx
            ├── main.jsx
            ├── storyScreen.css
            ├── .DS_Store
            ├── assets/
            │   ├── Happy1.webp
            │   ├── Helpful.webp
            │   ├── Thinking1.webp
            │   ├── Typewriter.jsx
            │   ├── .DS_Store
            │   └── badges/
            ├── components/
            │   ├── QuestionaireForUsers.jsx
            │   ├── SQLEditor.jsx
            │   ├── .DS_Store
            │   ├── Context/
            │   │   └── GameContext.jsx
            │   ├── Login/
            │   │   ├── AuthContext.jsx
            │   │   ├── Login.jsx
            │   │   ├── PrivateRoute.jsx
            │   │   └── Register.jsx
            │   ├── Modal/
            │   │   ├── BadgeModal.jsx
            │   │   ├── HintModal.jsx
            │   │   └── LogoutModal.jsx
            │   ├── Sidebar/
            │   │   ├── LeftSidebar/
            │   │   │   └── LeftSidebar.jsx
            │   │   └── RightSidebar/
            │   │       ├── AIAssistant.jsx
            │   │       ├── DifficultyChart.jsx
            │   │       └── RightSidebar.jsx
            │   └── SQLEditorComponents/
            │       ├── DisplayTables.jsx
            │       ├── Editor.jsx
            │       ├── QueryResult.jsx
            │       ├── TableList.jsx
            │       └── TableTab.jsx
            ├── data/
            │   ├── badges.js
            │   ├── oldQuestions-backup.js
            │   ├── questions-copy.js
            │   ├── questions.js
            │   └── tables.js
            ├── styles/
            │   ├── AIAssistant.css
            │   ├── Authentication.css
            │   ├── DisplayTables.css
            │   ├── Editor.css
            │   ├── LeftSidebar.css
            │   ├── QueryResult.css
            │   ├── QuestionaireForUsers.css
            │   ├── RightSidebar.css
            │   ├── SQLEditor.css
            │   └── Modal/
            │       ├── BadgeModal.css
            │       ├── HintModal.css
            │       └── LogoutModal.css
            └── utils/
                ├── badgeEvaluator.js
                └── logger.js
```

---

## 🛠️ How to Run the Project Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-repo/hazraimran-sqlbeyond.git
cd hazraimran-sqlbeyond
```

---

### 2️⃣ Run the Backend (Server)

```bash
cd backend
npm install
npm run start
```

- The backend will run on **http://localhost:5001** (or the port configured in your `.env` file).
- Ensure you have a **MongoDB connection string** configured in `backend/.env`.

---

### 3️⃣ Run the Frontend (React App)

In a new terminal, run:

```bash
cd frontend
npm install
npm run dev
```

- The frontend will run on **http://localhost:5173** (or the port configured in `vite.config.js`).

---

### 4️⃣ (Optional) Seed Initial Data

If you want to pre-fill your MongoDB with sample questions, tables, and badges:

```bash
cd backend
node serverDataPush.js
```

---

### 5️⃣ Open the App

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API (test endpoint): [http://localhost:5000](http://localhost:5000)

---

## ✅ Summary of Key Commands

| Command                               | Description                            |
| ------------------------------------- | -------------------------------------- |
| `npm install` (in backend & frontend) | Install dependencies                   |
| `npm run start` (in backend)          | Start the backend server               |
| `npm run dev` (in frontend)           | Start the frontend in development mode |
| `node serverDataPush.js`              | Populate MongoDB with sample data      |


## 📁 File Overview — What Each File Does

### 🔧 Root & Configuration Files

| File | Description |
|------|-------------|
| `index.html` | Main HTML template for the React app. |
| `.env` | Stores environment variables (e.g., API URLs). |
| `package.json` | Defines project dependencies and scripts. |
| `package-lock.json` | Auto-generated lock file for dependency versions. |
| `vite.config.js` | Configuration for the Vite build tool. |
| `eslint.config.js` | ESLint setup for code linting. |
| `.gitignore` | Specifies files/folders Git should ignore. |
| `.gitattributes` | Defines Git repository attributes. |

### 🧠 Core App Files

| File | Description |
|------|-------------|
| `src/main.jsx` | React entry point. Mounts the main App. |
| `src/App.jsx` | Root component containing the application layout. |

### 📚 Context & State Management

| File | Description |
|------|-------------|
| `src/components/Context/GameContext.jsx` | Global context for managing game state (e.g., difficulty, points). |
| `src/components/Login/AuthContext.jsx` | Auth context to manage login state and user session. |

### 🔐 Authentication

| File | Description |
|------|-------------|
| `src/components/Login/Login.jsx` | Login form UI and logic. |
| `src/components/Login/Register.jsx` | User registration component. |
| `src/components/Login/PrivateRoute.jsx` | Wrapper to restrict access to authenticated routes. |

### 🕹️ Gameplay Components

| File | Description |
|------|-------------|
| `src/components/QuestionaireForUsers.jsx` | Quiz component that evaluates user knowledge. |
| `src/components/SQLEditor.jsx` | Core editor where users write and run SQL queries. |
| `src/components/SQLEditorComponents/Editor.jsx` | SQL input area with real-time editing. |
| `src/components/SQLEditorComponents/QueryResult.jsx` | Displays query output/results. |
| `src/components/SQLEditorComponents/DisplayTables.jsx` | Shows available SQL tables. |
| `src/components/SQLEditorComponents/TableList.jsx` | Sidebar list of available tables. |
| `src/components/SQLEditorComponents/TableTab.jsx` | Manages tab interface for viewing multiple tables. |

### 🧠 AI & Assistance

| File | Description |
|------|-------------|
| `src/components/Sidebar/RightSidebar/AIAssistant.jsx` | Handles interaction with the AI assistant (hints, guidance). |
| `src/components/Sidebar/RightSidebar/DifficultyChart.jsx` | Displays performance progress per difficulty. |
| `src/components/Sidebar/RightSidebar/RightSidebar.jsx` | Wrapper for the right sidebar with analytics and hints. |

### 🧭 Navigation & Layout

| File | Description |
|------|-------------|
| `src/components/Sidebar/LeftSidebar/LeftSidebar.jsx` | Sidebar navigation for app sections. |

### 🎯 Modals

| File | Description |
|------|-------------|
| `src/components/Modal/HintModal.jsx` | Modal showing hints from the AI assistant. |
| `src/components/Modal/BadgeModal.jsx` | Modal displaying badge achievements. |
| `src/components/Modal/LogoutModal.jsx` | Modal for logout confirmation. |

### 📊 Data Files

| File | Description |
|------|-------------|
| `src/data/questions.js` | Primary question bank used in quizzes. |
| `src/data/questions-copy.js` | A working or backup copy of question data. |
| `src/data/oldQuestions-backup.js` | Archive of older questions. |
| `src/data/tables.js` | SQL table schemas and data. |
| `src/data/badges.js` | Metadata and rules for unlocking badges. |

### 🎨 Styling

| File | Description |
|------|-------------|
| `src/styles/*.css` | Individual CSS files for corresponding components. |
| `src/styles/Modal/*.css` | Styling for different modals like Badge, Hint, Logout. |

### 🧰 Utilities

| File | Description |
|------|-------------|
| `src/utils/badgeEvaluator.js` | Logic for calculating badge eligibility. |
| `src/utils/logger.js` | Logging utility (for debugging or analytics). |
