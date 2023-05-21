const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successfull!");
  } catch (error) {
    console.log("Databaser connection failed!", error);
  }
};

module.exports = connectDb;
