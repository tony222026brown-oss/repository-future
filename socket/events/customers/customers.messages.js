import { getEachCustomerConversationsByPeriod } from "../../actions/customers/getEachCustomerConversationsByPeriod.js";

/* server/socket/events/customers/customers.messages.js */
export default function getEachCustomerConversations(io, socket) {
  socket.on("customers:message", async (payload, resp) => {
    try {
      if (!payload || typeof payload !== "object") {
        return resp?.({
          response: 1,
          message: "Payload invalide",
          datas: [],
        });
      }

      const {
        businessId,
        employeeId,
        customerId,
        dateFrom,
        dateTo,
      } = payload;

      if (
        businessId === undefined || businessId === null ||
        employeeId === undefined || employeeId === null ||
        customerId === undefined || customerId === null ||
        dateFrom === undefined || dateFrom === null ||
        dateTo === undefined || dateTo === null
      ) {
        return resp?.({
          response: 1,
          message: "Required filled",
          datas: [],
        });
      }

      const messages = await getEachCustomerConversationsByPeriod({
        businessId,
        employeeId,
        customerId,
        dateFrom,
        dateTo,
      });

      return resp?.({
        response: 0,
        message: "Got Messages",
        datas: messages,
      });
    } catch (error) {
      console.error(
        "❌ Server error\nEvent: customers:message\nPage: server/socket/events/customers/customers.messages.js",
        error
      );

      return resp?.({
        response: 1,
        message: "Error server",
        datas: [],
      });
    }
  });
}