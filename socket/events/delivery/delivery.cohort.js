import getDeliveredCohort from '../../actions/delivery/getDeliveredCohort.js';

/* server/socket/events/delivery.cohort.js */
export default function getDeliveredClientsCohort(io, socket) {
    socket.on('delivered:cohort', async (payload, resp) => {
        try {
            if (payload === null) {
                let msg = '❌ Server error: Payload is empty\nEvent: delivered:cohort\nPage: server/socket/events/delivery.cohort.js';
                console.error(msg);
                resp?.({
                    response: 1,
                    message: msg,
                });
            }

            const cohort = await getDeliveredCohort(payload.cohortIDs, payload.select);

            if (!cohort) {
                let msg = '❗ Error: There isn\'t current customers on your box\nEvent: delivered:cohort\nPage: server/events/delivery.cohort.js';
                console.error(msg);
                resp?.({
                    response: 1,
                    message: msg,
                });
            }

            return resp?.({
                response: 0,
                message: '✅ Event completed\nEvent: delivered:cohort',
                datas: cohort,
               });

        } catch (error) {
            let msg = '❌ Server error\nEvent: delivered:cohort\nPage: server/events/delivery.cohort.js';
            console.log(msg, error);
            resp?.({
                response: 1,
                message: msg,
            });
        }
    });
}