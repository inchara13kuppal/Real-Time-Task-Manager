# ⚡ MERN Real-Time Collaborative Task Manager

A full-stack implementation of a **Task Management System** built with the **MERN Stack** (MongoDB, Express, React, Node.js) featuring advanced real-time collaboration using **Socket.IO**. This project is designed to showcase modern web development skills for a robust portfolio.

---

## ✨ Key Features & Innovative Components

* **Real-Time Sync (Socket.IO):** Instant updates for task creation, deletion, and status changes across all connected users without page refresh.
* **Intuitive Kanban Boards:** Drag-and-drop functionality for managing tasks and updating their status easily (e.g., "To Do" to "In Progress").
* **Secure Authentication:** User profiles and secure login/registration implemented with **JWT (JSON Web Tokens)**.
* **Interactive Analytics:** A simple dashboard to visualize project progress and task distribution.

---

## 🛠️ Technology Stack

| Stack Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React** (with Hooks) | Building the user interface and managing state. |
| **Real-Time** | **Socket.IO** | Bi-directional communication for instant updates. |
| **Backend** | **Node.js & Express** | Creating the RESTful API and hosting the application logic. |
| **Database** | **MongoDB & Mongoose** | Flexible, document-based database for persistent storage. |
| **Styling** | **CSS** (or a library like Tailwind/Styled Components) | Application presentation and layout. |

---

## 📂 Project Structure

| Directory | Description | Key Files/Folders |
| :--- | :--- | :--- |
| `client/` | The React single-page application (SPA). | `src/components`, `src/pages`, `package.json` |
| `server/` | The Node.js/Express REST API and Socket.IO server. | `server.js`, `models/`, `routes/`, `.env` |

---

## 🚀 How to Run Locally

### Prerequisites

* **Node.js** (v14+)
* **MongoDB** (Local instance or Cloud Atlas account)

### 1. Backend Setup

1.  Navigate to the server directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a **`.env`** file and add your MongoDB connection string (e.g., `MONGO_URI="your_mongo_connection_string"`).
4.  Start the server: `npm start` (or using `nodemon` for development).

### 2. Frontend Setup

1.  Navigate to the client directory: `cd client`
2.  Install dependencies: `npm install`
3.  Start the client application: `npm start`

> 💡 **The application will typically open at `http://localhost:3000` for the client and the API will run on `http://localhost:5000`.**
