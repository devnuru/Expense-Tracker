import express from "express";
import { db } from "../config/db.js";

import {
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
} from "../controllers/transactionsControllers.js";

const router = express.Router();

// app.get("/", (req, res) => {
//   res.send("Hello from the backend!");
// });

router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryByUserId);

export default router;
