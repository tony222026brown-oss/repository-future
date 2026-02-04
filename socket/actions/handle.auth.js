/* server/socket/actions/handle.auth.js */
import { verifyToken } from "../../manage/jwt.js";

export const handleAuth = (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split?.(" ")[1];
      if (!token) return next(new Error("Authentication error"));
      const user = verifyToken(token);
      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  }