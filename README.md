# 🎓 Online Lecture Scheduling Module

A React-based web application designed for educational institutions to manage courses, instructors, and lecture schedules. This application features Role-Based Access Control (RBAC), conflict detection, and a secure login module with input constraints.

## 🚀 Features

### 🔐 Authentication & Security
* **Login/Logout Module:** Secure entry point with session state management.
* **Input Constraints:** Validates username length (>3 chars) and password length (>6 chars) before processing.
* **Role-Based Access Control (RBAC):**
    * **Admin:** Full access to manage courses, instructors, and all schedules.
    * **Instructor:** Restricted view (can only view their own assigned schedules).

### 📅 Scheduling Management
* **Conflict Detection:** Automatically prevents assigning an instructor to two lectures at the same time.
* **Course Management:** Add, edit, and delete courses with details like level, description, and images.
* **Batch Scheduling:** Assign specific time slots to courses and instructors.

### 🎨 User Interface
* **Responsive Design:** Built with Tailwind CSS for mobile and desktop compatibility.
* **Interactive Dashboard:** Real-time updates using React State.
* **Visual Indicators:** Color-coded alerts for errors and conflicts.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Hooks: `useState`)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** Local Component State

---

## ⚙️ Installation & Setup

1.  **Clone the repository** (or create a new React app):
    ```bash
    npx create-react-app lecture-scheduling
    cd lecture-scheduling
    ```

2.  **Install dependencies:**
    You need to install `lucide-react` for the icons to work.
    ```bash
    npm install lucide-react
    ```
    *Note: Ensure Tailwind CSS is configured in your project.*

3.  **Run the application:**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🔑 Demo Credentials

Since this project currently uses a mock database for demonstration purposes, use the following credentials to test the different roles:

### 1. Admin Access
* **Username:** `admin`
* **Password:** `password123`
* *Capabilities:* Can switch between panels, add/delete courses, schedule lectures.

### 2. Instructor Access
* **Username:** `sarah`
* **Password:** `password123`
* *Capabilities:* View-only access to "Dr. Sarah Johnson's" schedule. Cannot access Admin Panel.

---

## 📂 Project Structure

```text
src/
│   └── LectureSchedulingModule.js  # Main application logic
├── App.js                          # Imports and renders the module
├── index.css                       # Tailwind directives
└── ...
