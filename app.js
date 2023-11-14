const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const transactionsRoutes = require("./routes/transactions");
const authRoutes = require("./routes/auth");

const app = express();

const MONGODB_URI =
  "mongodb+srv://aneta:Fafanka94!@shop.ypxo1ke.mongodb.net/budget";

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/transactions", transactionsRoutes);
// app.use("/auth", authRoutes);
// a unify way to show errors
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
