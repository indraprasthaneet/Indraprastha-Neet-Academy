// import mongoose from "mongoose";

// const connectDb = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URL)
//         console.log("DB connected")
//     } catch (error) {
//         console.log("DB error")
//     }
// }

// export default connectDb
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ensure this is called before accessing env vars

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
  }
};

export default connectDb;
