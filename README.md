# Real-Time Chat Application

## Overview
This project is a full-stack real-time chat application built to support instant one-on-one messaging, media sharing, friend requests, and secure authentication. The application leverages **Socket.IO** for real-time communication, **Cloudinary** for image storage, and **Zustand** for state management. It follows secure development best practices, using **JWT-based authentication** with HttpOnly cookies. The system is deployed on **Render** for backend hosting and supports seamless messaging with typing indicators, message deletion, and dynamic updates.

---

## Features
### 1. Real-Time Messaging
- Instant one-on-one chat using **Socket.IO**.
- Real-time updates for message sending and receiving.
- Message deletion synchronized across users.

### 2. Media Sharing
- Upload and share images in chat.
- Images stored securely in **Cloudinary** with optimized delivery.

### 3. User Management
- User registration and login.
- User online/offline presence.
- Secure authentication with **JWT tokens stored in cookies**.
- Friend request system to allow users to connect only with approved friends.

### 4. Frontend Architecture
- Built with **React**.
- **Zustand** for efficient and lightweight state management.
- API communication through **Axios**.
- Modular component structure for scalability.

### 5. Backend Architecture
- Node.js + Express.js server.
- REST APIs for authentication, user management, and message operations.
- Socket.IO server instance for real-time events.
- MongoDB used as primary database.

### 6. Deployment
- Backend deployed on **Render**.
- Environment variables securely configured.
- Cloudinary integrated via environment configuration.

---

## Tech Stack
### Frontend
- React.js
- Zustand
- Axios
- TailwindCSS

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- Cloudinary SDK

### DevOps / Deployment
- Render (Backend Hosting)
- Cloudinary (Media Storage)

---

## System Architecture Diagram
```
|--- Client (React) ---|
        |
        | Socket.IO + REST (Axios)
        |
|--- Node.js + Express + Socket.IO ---|
        |
        | Mongoose
        |
|--- MongoDB Database ---|
        |
        | Cloudinary SDK
        |
|--- Cloudinary Media Storage ---|
```

---

## Installation & Setup
### 1. Clone the Repository
```bash
git clone <repo-url>
cd chat-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file:
```
MONGO_URI=your_mongo_connection_string
PORT=port_number
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Socket.IO Events
### Server → Client Events
- `getOnlineUsers`: Map the online users.
- `newMessage`: Real-time delivery of incoming messages.
- `messagedelete`: Synchronize deleted message.

---

## Project Structure
```
chat-app/
│
├── backend/
│    ├── src/
│    │   ├── controllers/
│    │   ├── lib/
│    │   ├── middleware/
│    │   ├── models/
│    │   ├── models/
│    │   └── index.js
│    └── .env
│
├── frontend/
│    ├── src/
│    │   ├── components/
│    │   ├── lib/
│    │   ├── pages/
│    │   ├── store/ (Zustand)
│    │   ├── App.jsx
│    │   ├── index.css
│    │   └── main.jsx
│    └── index.html
```

---

## Security Practices
- JWT stored in **HttpOnly cookies** to prevent XSS token theft.
- Password hashing using **bcrypt**.
- CORS configured with strict allowed origins.
- Environment variables for all secrets.

---

## Future Enhancements
- Group chats.
- Push notifications.
- Rate limiting.
- Message caching.
- Voice and video calls.

---

## Contact
For questions or collaborations, please reach out.
