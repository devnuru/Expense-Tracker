// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiterMiddleware from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(rateLimiterMiddleware); // Apply the rate limiter middleware to all routes
app.use(express.json());

const PORT = process.env.PORT || 3001;

//Our custom simple middleware
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

app.get("/", (req, res) => {
  res.send("Welcome to the Expense Tracker API");
});

app.use("/api/expenses", transactionsRoute);

// Start the server after initializing the database

// console.log("my port:", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
