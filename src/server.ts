import "module-alias/register";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./route";
import cors from "cors";
import { corsOptions } from "./config/cors.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { Server as SocketIOServer } from "socket.io";
import { dbConnection } from "./dbConnection";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));
// mongoose.set("debug", true);

app.use("/api", router);
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Not Found, Route does not exist",
  });
});

app.use(errorMiddleware);

// Start server
(async () => {
  try {
    await dbConnection(); // wait for DB
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
    const io = new SocketIOServer(server, {
      pingTimeout: 60000, // connection will be closed after 60 seconds of inactivity
      cors: {
        origin: process.env.Web_URL,
        methods: ["GET", "POST", "PATCH", "DELETE"],
      },
    });

    // Socket.IO Setup
    io.on("connection", (socket) => {
      console.log("\n⚡ New client connected:", socket.id);

      // on setup request
      socket.on("setup", (userData) => {
        socket.join(userData._id); // create a room for logged in user id
        socket.emit("connected");
        console.log("\nUser connected:", userData._id);
      });

      socket.on("join chat", (room) => {
        // create a room for current chat id
        socket.join(room);
        console.log("\nUser joined room:", room);
      });

      socket.on("typing", (room) => {
        console.log("typing in room:", room);
        socket.in(room).emit("typing");
      });

      socket.on("stop typing", (room) => {
        console.log("stop typing in room:", room);
        socket.in(room).emit("stop typing");
      });

      socket.on("new message", (message) => {
        const chat = message.chat;
        if (!chat?.users) return console.log("No Users in Chat");
        console.log("\nnew message", message._id);
        chat.users.forEach((user: any) => {
          if (user === message.sender._id) return;
          socket.in(user).emit("message received", message); // send new message to all users except sender
        });
      });

      socket.on("disconnect", () => {
        console.log("\nClient disconnected:", socket.id);
      });
    });
  } catch (err) {
    process.exit(1);
  }
})();
