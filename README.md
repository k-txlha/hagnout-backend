
# **Hangout**

#### Sync, Chat, Listen: All Together in Real-Time!
Hangout is a real-time social music platform that allows users to create rooms, invite friends, and enjoy synchronized music playback while chatting. Inspired by Discord's design, it fosters a dynamic and interactive social experience.

## 🚀 Features
* 🎧 Synchronized Music Streaming – Listen to music in perfect sync with others.
* 💬 Live Chat – Engage in real-time conversations while enjoying music.
* 🎵 Custom Rooms – Create or join rooms based on genres or moods.
* 🎨 Modern UI Design – A sleek and visually appealing interface.
* 🔒 User Authentication – Secure login and account management.

## 🛠️ Tech Stack
#### Backend
* Node.js – JavaScript runtime for server-side development
* Express.js – Lightweight and fast backend framework.
* MongoDB – NoSQL database for storing user and room data.
* Socket.io – Enables real-time chat and music synchronization.
* Redis – Enhances performance with in-memory caching.
* RabbitMQ – Implements message queuing for asynchronous processing.
* Firebase – Cloud storage solution for managing user-uploaded files.
* Moment.js – Handles timestamp formatting.
#### Frontend
* React.js – Component-based framework for building an interactive UI.
* Tailwind CSS – Utility-first framework for efficient styling.

## 📦 Installation Guide
#### Prerequisites
Ensure you have the following installed:
* Node.js and npm
* MongoDB (local or MongoDB Atlas)
* Redis and RabbitMQ (running locally or on a server)
* A configured Firebase project for file storage
#### Setup Instructions
 * Clone the repository:
```
    git clone https://github.com/your-username/hangout.git
    cd hangout
```
 * Install dependencies:
```         
    npm install
```
 * Configure environment variables: Create a .env file in the project root and add the following:
```
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    REDIS_URL=your_redis_connection_string
    RABBITMQ_URL=your_rabbitmq_connection_string
    FIREBASE_CONFIG=your_firebase_config
```
 * Start the server:
  
```
    npm start
```
