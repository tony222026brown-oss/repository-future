/* server/socket/socket.js */
import { Server } from "socket.io";
import { registerMessageSend } from "./events/message.send.js";
import { registerTyping } from "./events/typing.js";
import { registerMessageRead } from "./events/message.read.js";
import { registerMessageHistory } from "./events/message.history.js";
import { registerDisconnect } from "./events/disconnect.js";
import { handleAuth } from "./actions/handle.auth.js";

// ----> create variable accessible every where
let io;

// ----> function to `initialized socket`
export function initSocket(server) {
  // ----> grant address from app
  io = new Server(server, {
    cors: { origin: true, credentials: true },
  });

  // handshake auth
  io.use(handleAuth);

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
