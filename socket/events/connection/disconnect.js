export function disconnectUser(io, socket) {
    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected ${socket.id} user=${socket.user?.userID} reason=${reason}`);
        // Optionally: emit presence update to other users
    });
}
