import { neon } from "@neondatabase/serverless";
import "dotenv/config";
4;
// Creates a SQL connection using our DB URL from the .env file
export const db = neon(process.env.DATABASE_URL);
