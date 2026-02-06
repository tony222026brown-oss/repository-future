/* server/socket/socket.js */
import { Server } from "socket.io";
import { eventOnPathMessage } from "./events/message.send.js";
import { eventOnUserTyping } from "./events/typing.js";
import { eventOnMessageRead } from "./events/message.read.js";
import { getMessageFromConversation } from "./events/message.history.js";
import { disconnectUser } from "./events/disconnect.js";
import { handleAuth } from "./actions/handle.auth.js";

// ----> create variable accessible every where
let io;

// ----> function to `initialized socket`
export function initSocket(server) {
  // ----> grant address from app
  io = new Server(server, {
    cors: { origin: true, credentials: true },
  });

  // ----> send `token.data` on socket
  io.use(handleAuth);

  // ----> manage global actions
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id} user=${socket.user.userID}`);

    // ----> join a private room for the user
    const userRoom = `user(${socket.user.userID})`;
    socket.join(userRoom);

    // ---> register all event handlers
    eventOnPathMessage(io, socket);
    eventOnUserTyping(io, socket);
    eventOnMessageRead(io, socket);
    getMessageFromConversation(io, socket);
    disconnectUser(io, socket);
  });

  return io;
}
