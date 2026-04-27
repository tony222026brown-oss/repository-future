import Deliver from '../../../models/Deliver.js';

/* server/socket/actions/updateClientDelivered.js */
export async function updateClientDelivered(listIDs = []) {
    if (!Array.isArray(listIDs) || listIDs.length === 0) return;

    const result = await Deliver.updateMany(
        { id: { $in: listIDs } },
        {
            $set: {
                isDelivered: true
            }
        }
    );

    console.log("UPDATE RESULT:", result);

    return result;
}

