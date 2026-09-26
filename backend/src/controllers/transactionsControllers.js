import { db } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
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
}

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

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
}

export async function deleteTransaction(req, res) {
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
}

export async function getSummaryByUserId(req, res) {
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
}
