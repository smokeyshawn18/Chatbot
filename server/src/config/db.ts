import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "chatbot_user",
  password: process.env.DB_PASSWORD || "secure_password",
  database: process.env.DB_NAME || "college_chatbot",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
