import mongoose from 'mongoose';
import messageModel from '../../models/Message.js';

messageModel.watch([{ $match: { operationType: 'insert' } }])
    .on('change', change => {
        const newMessage = change.fullDocument;
        console.log('✅ New message detected:', newMessage);

        // Identifier le destinataire et l’envoyer en temps réel
        const receiverRoom = `user(${newMessage.receiverId})`;

        io.to(receiverRoom).emit('message:receive', {
            messageId: newMessage.messageId,
            senderId: newMessage.senderId,
            receiverId: newMessage.receiverId,
            text: newMessage.text,
            media: newMessage.media,
            file: newMessage.file,
            createdAt: newMessage.createdAt
        });
    });

messageModel.watch([{ $match: { operationType: 'update' } }])
    .on('change', change => {
        const updatedFields = change.updateDescription.updatedFields;
        if (updatedFields.readAt) {
            // Notifier le sender que le message a été lu
            const messageId = change.documentKey._id.toString();
            const senderId = null; // récupérer l'info senderId
        io.to(`user(${senderId})`).emit('message:read', {
            messageId,
            readAt: updatedFields.readAt
        });
    }
    // Pareil pour deliveredAt etc.
  });

