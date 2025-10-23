# Chat Application — Backend

## Overview

A **real-time chat application backend** built with Node.js, Express, and TypeScript. This backend provides APIs for user authentication, chat management, and real-time messaging via Socket.IO.

- **Backend Repository**: [https://github.com/Shikha115/chat-application-backend](https://github.com/Shikha115/chat-application-backend)
- **Frontend Repository**: [https://github.com/Shikha115/chat-application-frontend](https://github.com/Shikha115/chat-application-frontend)

## Features

- **Real-time Messaging**: WebSocket-based messaging with Socket.IO.
- **User Authentication**: JWT-based login and registration.
- **Chat Management**: Create and manage one-on-one and group chats.
- **Database**: MongoDB with Mongoose.

## Tech Stack

- **Node.js**: JavaScript runtime.
- **Express**: Web framework.
- **TypeScript**: Typed JavaScript.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Socket.IO**: Real-time communication.
- **JWT**: Authentication.
- **Multer**: File uploads.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Shikha115/chat-application-backend.git
   cd chat-application-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Setup

Create `.env` and set:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret
Web_URL=http://localhost:3000
```

## Running the Application

### Development

```bash
npm run dev
```

Server runs at [http://localhost:8080](http://localhost:8080).

### Production

```bash
npm run build
npm start
```

## API Endpoints

- **User**: `/api/user` - Authentication and user management.
- **Chat**: `/api/chat` - Chat creation and management.
- **Message**: `/api/message` - Message handling.

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Commit changes.
4. Open a Pull Request.

## License

ISC License.
