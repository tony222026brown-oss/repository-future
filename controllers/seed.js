import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = "YOUR_MONGO_URI_HERE";

const namesList = [
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
    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB");

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
}