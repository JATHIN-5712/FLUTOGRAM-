# Flutogram - AI-Powered Social Platform

Flutogram is a modern, responsive social media web application prototype. It features a familiar user interface and integrates the Google Gemini API to generate dynamic and creative content suggestions for users. The application is built with React, TypeScript, and Tailwind CSS for the frontend, and includes a full-featured backend server using Node.js, Express, and Socket.IO for real-time communication.

## Features

- **User Authentication**: Secure user registration and login with persistent sessions (JWT).
- **Feed**: A central place to view posts from other users.
- **Create Posts**: Users can create text posts, upload images, or record and upload short videos.
- **AI-Powered Content**: The "Explore" page uses the Gemini API to generate unique post ideas, complete with text and images.
- **Real-time Chat**:
    - **Private Messaging**: One-on-one real-time chat with other users.
    - **Global Group Chat**: A public chat room where all online users can communicate.
    - **Typing Indicators**: See when the other user is typing a message.
- **Profiles**: View user profiles with their posts and reels.
- **Friend System**: Send and accept friend requests.
- **Notifications**: Receive notifications for likes, comments, and friend requests.
- **Stories & Reels**: View ephemeral stories and short-form video content.
- **Responsive Design**: The UI is designed to work on various screen sizes.

---

## Backend Server Setup & Instructions

This project contains a full-featured backend server built with Node.js, Express, and Socket.IO. The code for the server is located in the `backend/server.js` file.

### **1. Prerequisites**

- You must have [Node.js](https://nodejs.org/) installed on your computer (which includes `npm`).

### **2. Setup**

1.  **Navigate into the `backend` directory** in your terminal:
    ```bash
    cd backend
    ```
2.  **Install the required dependencies**:
    This command reads the new `package.json` file and installs all the necessary packages.
    ```bash
    npm install
    ```

### **3. Run the Server**

- From inside the `backend` directory, run the following command in your terminal:
  ```bash
  npm start
  ```
- This command executes the `start` script defined in `package.json`. You should see the message: `🚀 Server running on http://localhost:3001`. The backend is now running and ready to accept connections from your frontend.

### Troubleshooting

-   **`Error: listen EADDRINUSE: address already in use :::3001`**: This means another application is already using port 3001. You can either stop that other application or change the `PORT` variable in `server.js` to a different number (e.g., `3002`).
-   **CORS Errors in Browser Console**: The `cors` package is configured to allow requests from any origin (`*`). If you still see CORS errors, ensure you are running the server and that your frontend is correctly making requests to `http://localhost:3001`.
-   **Data Resets on Restart**: This is expected behavior. The server uses an in-memory "database", which means all data (new users, posts, messages) is lost when the server is stopped. For persistent data, you would need to integrate a real database like MongoDB, PostgreSQL, or a file-based one like SQLite.