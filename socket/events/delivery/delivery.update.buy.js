import { actionDeliveredToBuy } from '../../actions/delivery/actionDeliveredToBuy.js';

/* server/socket/events/delivery/delivery.update.buy.js */
export default function updateDeliveredToBuy(io, socket) {
    socket.on('delivered:update:buy', async (payload, resp) => {
        try {
            if(payload === null) {
                let msg = '❌ Server error: Payload is empty\nEvent: delivered:update:buy\nPage: server/socket/events/delivery/delivery.history.js';
                console.error(msg);
                resp?.({
                  response: 1,
                  message: msg,
                });
               }

            const update = await actionDeliveredToBuy(payload.groupIDs, payload.employeeId);
        } catch (error) {
            let msg = '❌ Server error\nEvent: delivered:update:buy\nPage: server/socket/events/delivery/delivery.history.js';
            console.log(msg, error);
            resp?.({
              response: 1,
              message: msg,
            });
        }
    });
}