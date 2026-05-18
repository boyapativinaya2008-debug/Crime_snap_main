const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn=await mongoose.connect(process.env.MONGO_URI, {
  dbName: "civicapp",
});
console.log("Connected DB:", mongoose.connection.name);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;