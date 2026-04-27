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

               const { groupIDs, employeeId, businessId } = payload;

               const result = await actionDeliveredToBuy(
                   groupIDs,
                   employeeId,
                   businessId
               );
   
               resp?.({
                   response: 0,
                   data: result,
               });
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