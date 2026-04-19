import Deliver from "../../models/Deliver.js";

/* server/socket/change/delivered.watch.js */
let deliveredWatch = null;
let restartTimer = null;

export function checkDeliveredUpdate(io) {
  if (deliveredWatch) return;

  const startWatcher = () => {
    try {
      deliveredWatch = Deliver.watch([], {
        fullDocument: "updateLookup",
      });

      deliveredWatch.on("change", (change) => {
        try {
          if (change.operationType !== "update") return;

          const updatedFields = change.updateDescription?.updatedFields || {};
          if (!Object.prototype.hasOwnProperty.call(updatedFields, "isDelivered")) {
            return;
          }

          const doc = change.fullDocument;
          if (!doc) return;

          const employeeId = doc.currentEmployeeId?.toString?.() || doc.currentEmployeeId;
          const businessId = doc.currentBusinessId?.toString?.() || doc.currentBusinessId;

          const payload = {
            response: 0,
            message: "Delivery updated",
            data: doc,
          };

          if (employeeId) {
            io.to(`user(${employeeId})`).emit("delivered:update:isDelivered", payload);
          }

          if (businessId) {
            io.to(`business(${businessId})`).emit("delivered:update:isDelivered", payload);
          }
        } catch (error) {
          console.error("❌ Error handling change event for delivered:update:isDelivered", error);
        }
      });

      deliveredWatch.on("error", (error) => {
        console.error("❌ Error checking update on server\nEvent: delivered:update:isDelivered\nPage: server/socket/change/delivered.watch.js", error);

        try {
          deliveredWatch?.close();
        } catch {}
        deliveredWatch = null;

        clearTimeout(restartTimer);
        restartTimer = setTimeout(startWatcher, 5000);
      });

      deliveredWatch.on("close", () => {
        deliveredWatch = null;
      });
    } catch (error) {
      console.error("❌ Error checking update on server\nEvent: delivered:update:isDelivered\nPage: server/socket/change/delivered.watch.js", error);

      deliveredWatch = null;
      clearTimeout(restartTimer);
      restartTimer = setTimeout(startWatcher, 5000);
    }
  };

  startWatcher();
}