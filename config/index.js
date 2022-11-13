const app = require("./app");

module.exports = {
   app,
   db_url: process.env.DB_URL || "",
   jwt_secret_key: process.env.JWT_SECRET_KEY || "",
}