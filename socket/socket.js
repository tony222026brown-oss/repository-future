import { Server } from "socket.io";
import { verifyToken } from "./manage/jwt.js";

import { registerMessageSend } from "./events/message.send.js";
import { registerTyping } from "./events/typing.js";
import { registerMessageRead } from "./events/message.read.js";
import { registerMessageHistory } from "./events/message.history.js";
import { registerDisconnect } from "./events/disconnect.js";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: true, credentials: true },
  });

  // handshake auth
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split?.(" ")[1];
      if (!token) return next(new Error("Authentication error"));
      const user = verifyToken(token);
      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} user=${socket.user.userID}`);

    // join a private room for the user
    const userRoom = `user:${socket.user.userID}`;
    socket.join(userRoom);

    // register all event handlers
    registerMessageSend(io, socket);
    registerTyping(io, socket);
    registerMessageRead(io, socket);
    registerMessageHistory(io, socket);
    registerDisconnect(io, socket);
  });

  return io;
}
