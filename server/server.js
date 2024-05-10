const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

//Routes

app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.log("Mongodb connection error", err));

app.listen(port, ()=> console.log(`App is running on port ${port}`))
