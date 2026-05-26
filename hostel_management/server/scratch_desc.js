import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });
import pool from "./src/config/db.js";

async function inspect() {
  try {
    const [cols] = await pool.query("DESCRIBE student");
    console.log(cols);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

inspect();
