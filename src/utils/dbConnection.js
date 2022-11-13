const mongoose = require("mongoose");

exports.connectToDatabase = async () => {
  try {
    const uri = config.db_url;
    const conn = await mongoose.connect(uri);
    if (conn) console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
