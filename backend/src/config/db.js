import { neon } from "@neondatabase/serverless";
import "dotenv/config";
4;
// Creates a SQL connection using our DB URL from the .env file
export const db = neon(process.env.DATABASE_URL);

export async function initDB() {
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
