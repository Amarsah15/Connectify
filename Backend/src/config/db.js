import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Auto-migrate users lacking a username
    const User = (await import("../models/User.js")).default;
    const usersWithoutUsername = await User.find({ username: { $exists: false } });
    if (usersWithoutUsername.length > 0) {
      console.log(`Migrating ${usersWithoutUsername.length} users to assign usernames...`);
      for (const u of usersWithoutUsername) {
        let base = u.name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
        if (!base || base === "_") base = "user";
        let proposed = base;
        let counter = 1;
        while (await User.findOne({ username: proposed })) {
          proposed = `${base}_${counter}`;
          counter++;
        }
        u.username = proposed;
        await u.save();
      }
      console.log("Usernames migration completed successfully.");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
