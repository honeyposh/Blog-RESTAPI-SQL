const express = require("express");
const sequelize = require("./utils/database");
const errorHandler = require("./middleware/error");
const User = require("./models/userModel");
const Post = require("./models/postModel");
const morgan = require("morgan");
require("dotenv").config();
const port = process.env.PORT || 8000;
// const cors = require("cors");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const cookieParser = require("cookie-parser");
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", authRoute);
app.use("/api", postRoute);
app.use(errorHandler);
// app.use(cors);
sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("connected");
    app.listen(port);
  })
  .catch((error) => {
    throw error;
  });
