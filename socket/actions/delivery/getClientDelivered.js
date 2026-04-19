import Deliver from '../../../models/Deliver.js';

/* server/socket/actions/getClientDelivered.js */
export async function getClientDelivered(currentBusinessId, currentEmployeeId, batch) {
    const clients = await Deliver.find(
        {
            currentBusinessId,
            currentEmployeeId,
            hasBeenBuy: false,
            isDelivered: true,
        },
    )
        .sort({ timeDeliver: -1 })
        .limit(batch)
        .lean();

    return clients;
}