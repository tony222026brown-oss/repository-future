import Deliver from '../../../models/Deliver.js';

/* server/socket/actions/getDeliveredCohort.js */
export default async function getDeliveredCohort(listIDs = [], select) {
    return await Deliver.find({
        id: { $in: listIDs }
    })
        .limit(select)
        .lean();
}