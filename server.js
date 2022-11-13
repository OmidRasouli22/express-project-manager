const path = require("path");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");

const { connectToDatabase } = require("./src/utils/dbConnection");
const routes = require('./src/routes');

const app = express();
//* Initialize dotEnv Config
dotEnv.config();

//* Global Config
global.config = require("./config");

//* Use BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//* Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Use Cors
app.use(cors());

//* Use Helmet
app.use(helmet());

//*Connection to database
connectToDatabase();

//* Config Routes
app.use(routes); 

//* Starting Server
const port = config.app.port;
app.listen(port, () => {
  console.log(`Server is Running on PORT: ${port}`);
});
