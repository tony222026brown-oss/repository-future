import { getCustomersHistoricByEmployee } from "../../actions/customers/getCustomersHistoricByEmployee.js";

/* server/socket/events/customers/customers.history.js */
export default function getCustomersHistoric(io, socket) {
    socket.on("customers:historic", async (payload, resp) => {
        try {
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
          console.error("❌ customers:historic error", error);
          return resp?.({
            response: 1,
            message: "Server error",
            datas: [],
          });
        }
      });
}