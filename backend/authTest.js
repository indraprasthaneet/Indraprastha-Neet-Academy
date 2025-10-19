// Simple test script to verify authentication flow
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Test the token generation
const testTokenGeneration = async () => {
  try {
    console.log("Testing token generation...");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    
    // Test token creation
    const userId = "test123";
    const role = "student";
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("Generated token:", token);
    
    // Test token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    
    console.log("Token generation and verification successful!");
  } catch (error) {
    console.error("Token test failed:", error.message);
  }
};

// Test password hashing
const testPasswordHashing = async () => {
  try {
    console.log("\nTesting password hashing...");
    const password = "testpassword123";
    const hashed = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashed);
    
    const isMatch = await bcrypt.compare(password, hashed);
    console.log("Password match:", isMatch);
    
    console.log("Password hashing successful!");
  } catch (error) {
    console.error("Password hashing test failed:", error.message);
  }
};

// Run tests
testTokenGeneration();
testPasswordHashing();