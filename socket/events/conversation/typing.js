/* server/socket/evets/typing.js */
export function eventOnUserTyping(io, socket) {
    socket.on("typing", (payload) => {
        // ----> check if `receiverId` exist
        if (!payload?.receiverId) return;

        // ----> notify `receiverId` `senderId` isTyping
        io.to(`user(${payload.receiverId})`).emit("typing", {
            senderId: socket.user.userID,
            isTyping: !!payload.isTyping
        });
    });
}
