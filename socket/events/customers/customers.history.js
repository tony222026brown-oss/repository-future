import Customer from "../../../models/Customer.js";
import { getCustomersHistoricByEmployee } from "../../actions/customers/getCustomersHistByEmpl.js";


/* server/socket/events/customers/customers.history.js */
export function getCustomersHistoric(io, socket) {
  socket.on("customers:historic", async (payload, resp) => {
    console.log("📩 customers:historic payload", payload);
    console.log("TYPE employeeId:", Customer.schema.path('employeeId').instance);

    try {
      console.log("🔥 EVENT customers:historic RECEIVED");
      console.log("payload:", payload);
      console.log("resp exists:", typeof resp);

      if (!payload || typeof payload !== "object") {
        return resp?.({
          response: 1,
          message: "Payload invalide",
          datas: [],
        });
      }

      const { businessId, employeeId } = payload;

      if (!businessId || !employeeId) {
        return resp?.({
          response: 1,
          message: "businessId and employeeId is required",
          datas: [],
        });
      }

      const customers = await getCustomersHistoricByEmployee({
        businessId,
        employeeId,
      });

      return resp?.({
        response: 0,
        message: "Historic clients get",
        datas: customers,
      });
    } catch (error) {
      console.log("❌ customers:historic error");
      console.log(error);
      console.log(error.stack);
      return resp?.({
        response: 1,
        message: `Server error ${error.stack}`,
        datas: [],
      });
    }
  });
}