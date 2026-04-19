import Deliver from '../../../models/Deliver.js';

/* server/socket/actions/actionClientDelivered.js */
export async function actionDeliveredToBuy(listIDs = [], employeeId) {
    return await Deliver.updateMany(
      {
        id: { $in: listIDs },
        hasBeenBuy: false,
        currentEmployeeId: employeeId
      },
      {
        $set: {
          hasBeenBuy: true,
          boughtAt: new Date()
        }
      }
    );
  }