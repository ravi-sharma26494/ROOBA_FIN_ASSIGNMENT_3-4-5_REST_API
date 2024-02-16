const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");

const userRoute = require("./routes/userRoutes");
const requestLoggerMiddleware = require("./middlewares/logsMiddleware");
const PORT = process.env.PORT || 8000;

const app = express();

// The logger Middleware from Assinment: 4
//Logs Middleware
app.use(requestLoggerMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes Middleware
app.use("/api/users", userRoute);

//Test Route:
app.get("/", (req, res) => {
  res.send("Hello the site is live");
});

// Db connection and starting the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`PLEASE LOOK AT THE HOW_TO.docx file on the source code.`);
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
