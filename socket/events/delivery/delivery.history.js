import { getClientDelivered } from '../../actions/delivery/getClientDelivered.js';
import { updateClientDelivered } from '../../actions/delivery/updateClientDelivered.js';

/* server/socket/events/delivery.history.js */
export default function getDeliveredHistoric(io, socket) {
    socket.on('delivered:historic', async (payload, resp) => {
       try {
         if(payload === null) {
          let msg = '❌ Server error: Payload is empty\nEvent: delivered:historic\nPage: server/socket/events/delivery.history.js';
          console.error(msg);
          resp?.({
            response: 1,
            message: msg,
          });
         }

         const clientsDelivered = await getClientDelivered(
          payload.businessID, 
          payload.employeeInChargeID, 
          payload.batch,
        );

        if(clientsDelivered.length == 0) {
          let msg = '❗ Error: There isn\'t current customers on your box\nEvent: delivered:historic\nPage: server/socket/events/delivery.history.js';
          console.error(msg);
          resp?.({
            response: 1,
            message: msg,
          });
        }

        let listIDs = clientsDelivered.map((e) => e.id);

        const updateClients = await updateClientDelivered(listIDs);

        if(!updateClients) {
          let msg = '❗ Error: Failed to update clients delivered\nEvent: delivered:historic\nPage: server/socket/events/delivery.history.js';
          console.error(msg);
          resp?.({
            response: 1,
            message: msg,
          });
        }

         return resp?.({
          response: 0,
          message: '✅ Event completed\nEvent: delivered:historic',
          datas: clientsDelivered,
         });
       } catch(error) {
        let msg = '❌ Server error on\nEvent: delivered:historic\nPage: server/events/delivery.history.js';
        console.log(msg, error);
        resp?.({
          response: 1,
          message: msg,
        });
       }
    });
}