export function registerTyping(io, socket) {
    socket.on("typing", (payload) => {
        if (!payload?.to) return;
        io.to(`user:${payload.to}`).emit("typing", {
            from: socket.user.userID,
            isTyping: !!payload.isTyping
        });
    });
}
