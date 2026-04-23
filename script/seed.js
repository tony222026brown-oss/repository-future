// server/controllers/seed.js
import User from "../models/User.js";
import Business from "../models/Business.js";
import Employee from "../models/Employee.js";
import Deliver from "../models/Deliver.js";
import Customer from "../models/Customer.js";
import Message from "../models/Message.js";

const GARRY_USER_ID = "fr_user_001";
const LEAD_USER_ID = "lead_yc_001";

const BUSINESS_ID = "business_yc_001";
const EMPLOYEE_ID = "employee_yc_001";
const DELIVER_ID = "deliver_yc_001";
const CUSTOMER_ID = "customer_yc_001";


// ---------------- USER ----------------
async function ensureGarryTan() {
  return User.findOneAndUpdate(
    { userID: GARRY_USER_ID },
    {
      $set: {
        userID: GARRY_USER_ID,
        type: "company",
        anonymous: "gt123",
        name: "Garry Tan",
        gender: "Male",
        profileImage: "assets/images/gt.png",
        location: {
          country: "United States",
          city: "San Francisco",
          district: "California",
        },
        badge: "verified",
        status: "CEO of Y Combinator",
        bio: "",
        hasAccount: true,
        isLoggedIn: true,
        contentLike: 0,
        lastMessage: "",
        newMessages: 0,
        sentBox: false,
        secure: false,
      },
    },
    { upsert: true, new: true }
  );
}

async function ensureLeadUser() {
  return User.findOneAndUpdate(
    { userID: LEAD_USER_ID },
    {
      $set: {
        userID: LEAD_USER_ID,
        type: "era",
        anonymous: "lead_yc_001",
        name: "Jane Founder",
        gender: "Female",
        profileImage: "assets/images/profile.jpg",
        location: {
          country: "United States",
          city: "San Francisco",
          district: "Mission",
        },
        badge: "none",
        status: "Founder looking for growth",
        bio: "Interested in startup tools and acquisition.",
        hasAccount: true,
        isLoggedIn: false,
        contentLike: 0,
        lastMessage: "",
        newMessages: 0,
        sentBox: false,
        secure: false,
      },
    },
    { upsert: true, new: true }
  );
}


// ---------------- BUSINESS ----------------
async function ensureBusiness() {
  return Business.findOneAndUpdate(
    { id: BUSINESS_ID },
    {
      $set: {
        id: BUSINESS_ID,
        businessOwnerId: GARRY_USER_ID, // ✅ STRING
        businessName: "Y Combinator",
        businessPhoto: "assets/images/yc.png",
        isSync: true,
        biography: "Startup accelerator helping founders build companies.",
        businessType: 3,
        syncAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}


// ---------------- EMPLOYEE ----------------
async function ensureEmployee() {
  return Employee.findOneAndUpdate(
    { id: EMPLOYEE_ID },
    {
      $set: {
        id: EMPLOYEE_ID,
        businessId: BUSINESS_ID,     // ✅ STRING
        employeeID: GARRY_USER_ID,   // ✅ STRING
        employeeName: "Garry Tan",
        employeePhoto: "assets/images/gt.png",
        employeeType: 0,
        groupClosedTo: [],
        permissionBlocked: [],
        arrivedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}


// ---------------- DELIVER (LEAD) ----------------
async function ensureDeliver() {
  return Deliver.findOneAndUpdate(
    { id: DELIVER_ID },
    {
      $set: {
        id: DELIVER_ID,
        clientID: LEAD_USER_ID,          // ✅ STRING
        clientName: "Jane Founder",
        clientGender: 1,
        clientPhotoProfile: "assets/images/profile.jpg",
        clientEmotion: "curious",
        clientLocation: "San Francisco",
        clientNeed: "Looking for a SaaS growth solution",
        isDelivered: true,
        hasBeenBuy: true,
        boughtAt: new Date(),
        currentBusinessId: BUSINESS_ID,  // ✅ STRING
        currentEmployeeId: EMPLOYEE_ID,  // ✅ STRING
        switchAccount: [],
        timeDeliver: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}


// ---------------- CUSTOMER ----------------
async function ensureCustomer() {
  return Customer.findOneAndUpdate(
    { id: CUSTOMER_ID },
    {
      $set: {
        id: CUSTOMER_ID,
        businessId: BUSINESS_ID,     // ✅ STRING
        employeeId: EMPLOYEE_ID,     // ✅ STRING
        slotPartOf: 1,
        userId: LEAD_USER_ID,        // ✅ DIRECT USER (PLUS SIMPLE)
        connected: true,
        userName: "Jane Founder",
        gender: 1,
        profileImage: "assets/images/profile.jpg",
        lastMessage: "Hello Garry, I need help growing my startup.",
        timeExpired: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        timeAcquired: new Date(),
        lastModified: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}


// ---------------- CONVERSATION ----------------
async function ensureConversation() {
  const now = Date.now();

  const messages = [
    {
      messageId: "msg_yc_001",
      senderId: LEAD_USER_ID,     // ✅ STRING
      receiverId: GARRY_USER_ID,  // ✅ STRING
      text: "Hi Garry, I am building a startup and need growth help.",
      type: 1,
      read: true,
      readAt: new Date(now + 60000),
      deliveredAt: new Date(now + 10000),
      createdAt: new Date(now),
    },
    {
      messageId: "msg_yc_002",
      senderId: GARRY_USER_ID,
      receiverId: LEAD_USER_ID,
      text: "Great. Tell me about your product and traction.",
      type: 1,
      read: false,
      deliveredAt: new Date(now + 90000),
      createdAt: new Date(now + 30000),
    },
  ];

  for (const msg of messages) {
    await Message.findOneAndUpdate(
      { messageId: msg.messageId },
      { $set: msg },
      { upsert: true }
    );
  }

  return messages;
}


// ---------------- MAIN ----------------
export default async function main() {
  await ensureGarryTan();
  await ensureLeadUser();

  await ensureBusiness();
  await ensureEmployee();

  await ensureDeliver();
  await ensureCustomer();

  const messages = await ensureConversation();

  console.log("🔥 Seed completed (STRING MODE)");
  console.log({
    garry: GARRY_USER_ID,
    lead: LEAD_USER_ID,
    business: BUSINESS_ID,
    employee: EMPLOYEE_ID,
    deliver: DELIVER_ID,
    customer: CUSTOMER_ID,
    messages: messages.map((m) => m.messageId),
  });
}

/*const namesList = [
  "Bar Francis",
  "Femme couture",
  "Style Fashion",
  "Laptop",
  "Commerce",
  "Bar Standing",
  "Bar Vibe",
  "Bar Comedy"
];

function generateUser(name, index) {
  return {
    userID: `user_${Date.now()}_${index}`,

    type: "company",

    name: name,
    anonymous: name.toLowerCase().replace(/\s/g, "_"),

    gender: "Organisation", // ✅ respecte enum

    location: {
      country: "Cameroon",
      city: "Yaounde",
      district: "Centre",
    },

    hasAccount: true,
    isLoggedIn: false,
  };
}

export async function seedUsers() {
  try {

    const users = namesList.map((name, index) =>
      generateUser(name, index)
    );

    await User.insertMany(users);

    console.log("🔥 Users inserted successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Error inserting users:", error);
    process.exit(1);
  }
}*/