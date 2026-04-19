/* server/socket/socket.js */
import { Server } from "socket.io";
import { eventOnPathMessage } from "./events/conversation/message.send.js";
import { eventOnUserTyping } from "./events/conversation/typing.js";
import { eventOnMessageRead } from "./events/conversation/message.read.js";
import { getMessageFromConversation } from "./events/conversation/message.history.js";
import { disconnectUser } from "./events/connection/disconnect.js";
import { handleAuth } from "./actions/auth/handle.auth.js";
import { initWatchOnMongoDB } from "./change/message.watch.js";
import { checkDeliveredUpdate } from "./change/delivered.watch.js";
import getDeliveredClientsCohort from "./events/delivery/delivery.cohort.js";
import getDeliveredHistoric from "./events/delivery/delivery.history.js";
import updateDeliveredToBuy from "./events/delivery/delivery.update.buy.js";
import { getCustomersHistoric } from "./events/customers/customers.history.js";
import getEachCustomerConversations from "./events/customers/customers.messages.js";

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

  // ----> watch MongoDB
  initWatchOnMongoDB(io);
  checkDeliveredUpdate(io);

  // ----> manage global actions
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id} user=${socket.user.userID}`);

    // ----> join a private room for the user
    const userRoom = `user(${socket.user.userID})`;
    socket.join(userRoom);

    // ---> register all event handlers
    // ---> Conversation
    eventOnPathMessage(io, socket);
    eventOnUserTyping(io, socket);
    eventOnMessageRead(io, socket);
    getMessageFromConversation(io, socket);

    // ---> Delivery
    getDeliveredHistoric(io, socket);
    getDeliveredClientsCohort(io, socket);
    updateDeliveredToBuy(io, socket);

    // ---> Customers
    getCustomersHistoric(io, socket);
    getEachCustomerConversations(io, socket);

    // ---> Connected/Disconnected
    disconnectUser(io, socket);
  });

  return io;
}
