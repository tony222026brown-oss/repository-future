import Deliver from '../../../models/Deliver.js';
import Customer from "../../../models/Customer.js";

/* server/socket/actions/actionClientDelivered.js */
export async function actionDeliveredToBuy(
  listIDs = [],
  employeeId,
  businessId
) {
  if (!Array.isArray(listIDs) || listIDs.length === 0) return [];

  // 1. 🔥 Récupérer les delivers
  const delivers = await Deliver.find({
    id: { $in: listIDs },
  });

  if (!delivers.length) return [];

  // 2. 🔥 Update Deliver
  await Deliver.updateMany(
    { id: { $in: listIDs } },
    {
      $set: {
        hasBeenBuy: true,
        isDelivered: true,
      },
    }
  );

  // 3. 🔥 CREATE / UPDATE CUSTOMER
  const customersOps = delivers.map((d) => ({
    updateOne: {
      filter: { id: d.clientID },
      update: {
        $set: {
          id: d.clientID,
          businessId,
          employeeId,
          userId: d.clientID,
          userName: d.clientName,
          gender: d.clientGender,
          profileImage: d.clientPhotoProfile,
          lastModified: new Date(),
        },
        $setOnInsert: {
          slotPartOf: 1,
          timeAcquired: new Date(),
        },
      },
      upsert: true,
    },
  }));

  await Customer.bulkWrite(customersOps);

  return delivers;
}