const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const globalErrorHandler = require("./controllers/globalErrorHandler");
const path = require("path");

const app = express();
dotenv.config({ path: "./config.env" });

// Accept json data
app.use(express.json());

// Connect database
connectDb();

const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

console.log(process.env.NODE_ENV);

const server = app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});

// Requiring socket.io which returns a function which needs to be called with the server parameter
const io = require("socket.io")(server, {
   pingTimeout: 60000,
   cors: {
      origin: "http://localhost:3000",
   },
});

function decryption(str) {
   let result = "";

   for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);

      // Check if character is a letter
      if (charCode >= 65 && charCode <= 90) {
         // Uppercase letters
         result += String.fromCharCode(((charCode - 65 - 3 + 26) % 26) + 65);
      } else if (charCode >= 97 && charCode <= 122) {
         // Lowercase letters
         result += String.fromCharCode(((charCode - 97 - 3 + 26) % 26) + 97);
      } else {
         // Non-letters
         result += str[i];
      }
   }

   return result;
}

// Creating a connection
io.on("connection", (socket) => {
   console.log("Conneceted to socket.io");

   socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
   });

   socket.on("join chat", (room, user) => {
      socket.join(room);
      console.log(`${user.name} joined room ${room}`);
   });

   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

   socket.on("new message", (message) => {
      const chat = message.chat;

      // console.log("message", message);

      // message.content = decryption(message.content);
      // console.log("decrpy message", message);

      // console.log(message);

      if (!chat?.users) return;

      chat.users.forEach((user) => {
         if (user._id == message.sender._id) return;

         socket.in(user._id).emit("message recieved", message);
      });
   });
});

// ----------DEPLOYMENT-------------
const __dirname1 = path.resolve();
if (
   process.env.NODE_ENV == "PRODUCTION" ||
   process.env.NODE_ENV == "production"
) {
   app.use(express.static(path.join(__dirname1, "/frontend/build")));

   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
   });
}

app.use(globalErrorHandler);
