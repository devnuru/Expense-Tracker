// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import { db } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

const PORT = process.env.PORT || 3001;

//Our custom simple middleware
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

async function initDB() {
  try {
    await db`CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // status code 1 indicates failure 0 success
  }
}

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.get("/api/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId);
    const expenses =
      await db`SELECT * FROM expenses WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/expenses", async (req, res) => {
  const { user_id, title, amount, category } = req.body;
  try {
    const { title, amount, category } = req.body;

    if (!user_id || !title || !category || amount === undefined) {
      return res.status(400).json({ emessage: "All fileds are required" });
    }

    const newExpense =
      await db`INSERT INTO expenses (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;

    console.log(newExpense);
    res.status(201).json(newExpense[0]);
  } catch (error) {
    console.error("Error creating the expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid expense ID" });
    }

    const deletedExpense =
      await db`DELETE FROM expenses WHERE id = ${id} RETURNING *`;

    if (deletedExpense.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting the expense", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/expenses/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const balanceResult =
      await db`SELECT COALESCE(SUM(amount), 0) as balance from expenses WHERE user_id = ${userId}`;

    const incomeResult = await db`
      SELECT COALESCE(SUM(amount), 0) as income from expenses 
      WHERE user_id = ${userId} AND amount > 0`;

    const expensesResult = await db`
      SELECT COALESCE(SUM(amount), 0) as expenses from expenses 
      WHERE user_id = ${userId} AND amount < 0`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server after initializing the database

// console.log("my port:", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
