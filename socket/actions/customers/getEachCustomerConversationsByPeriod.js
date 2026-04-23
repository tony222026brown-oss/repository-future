import Message from "../../../models/Message.js";

/* server/socket/actions/customers/getEachCustomerConversationByPeriod.js */
export async function getEachCustomerConversationsByPeriod({
  businessId,
  employeeId,
  customerId,
  dateFrom,
  dateTo,
}) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  return Message.find({
    $or: [
      { senderId: customerId, receiverId: employeeId },
      { senderId: employeeId, receiverId: customerId },
    ],
    createdAt: {
      $gte: from,
      $lt: to,
    },
  })
    .sort({ createdAt: 1 })
    .lean();
}