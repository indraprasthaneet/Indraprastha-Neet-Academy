import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import User from "./models/userModel.js";

dotenv.config();

const createTestUser = async () => {
  try {
    await connectDb();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      console.log("Test user already exists");
      process.exit(0);
    }
    
    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: "student"
    });
    
    await user.save();
    console.log("Test user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
};

createTestUser();