import Customer from "../../../models/Customer.js";

/* server/socket/actions/customers/getCustomersHistoricByEmployee.js */
export async function getCustomersHistoricByEmployee({ businessId, employeeId }) {
  return Customer.find({
    businessId: businessId,
    employeeId: employeeId,
  })
    .select("id businessId employeeId userId userName gender profileImage lastMessage timeExpired timeAcquired lastModified")
    .sort({ lastModified: -1 })
    .lean();
}