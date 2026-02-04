/* server/socket/actions/handle.auth.js */
import { verifyToken } from "../../manage/jwt.js";

export const handleAuth = (socket, next) => {
    try {
        // ----> get `token` from app
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split?.(" ")[1];
        
        // ----> if `token` is null send error
        if (!token) return next(new Error("❌ Authentication error"));

        // ----> Function to `transform token` and get initial data
        const user = verifyToken(token);

        // ----> Send this `data` to Socket
        socket.user = user;

        // ----> return `true`
        return next();
    } catch (err) {
        return next(new Error(`❌ Authentication error ${err}`));
    }
}