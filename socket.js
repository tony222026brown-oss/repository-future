import { Server } from "socket.io";
import { verifyToken } from "./utils/jwt.js";
import User from "./models/User.js";

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Token manquant"));

      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Token invalide"));
    }
  });

  io.on("connection", async (socket) => {
    const { userID, device } = socket.user;

    console.log(`🟢 ${userID} connecté (${device})`);

    // Marquer online
    await User.updateOne(
      { userID },
      { isLoggedIn: true, lastSeen: new Date() }
    );

    socket.join(userID);

    socket.on("disconnect", async () => {
      console.log(`🔴 ${userID} déconnecté`);

      await User.updateOne(
        { userID },
        { isLoggedIn: false, lastSeen: new Date() }
      );
    });
  });

  return io;
};

export { initSocket };
