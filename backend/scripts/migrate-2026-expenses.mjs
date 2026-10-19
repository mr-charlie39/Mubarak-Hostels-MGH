import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Always load backend/.env (same DB config the server uses), regardless of cwd.
const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(backendDir, ".env") });

const truthy = (v) => ["1", "true", "yes", "on"].includes(String(v || "").toLowerCase());

function sslConfig() {
  const HOST = process.env.DB_HOST || "localhost";
  const MANAGED = /aivencloud\.com|planetscale|azure\.com|amazonaws\.com|rdp\.mysql|googledb|cleardb|mysql\.digitalocean/i.test(HOST);
  const useSsl = truthy(process.env.DB_SSL) || (!process.env.DB_SSL && MANAGED);
  if (!useSsl) return undefined;
  const ca = process.env.DB_SSL_CA;
  if (ca && ca.includes("BEGIN CERTIFICATE")) return { ca: ca.replace(/\\n/g, "\n"), rejectUnauthorized: true };
  return { rejectUnauthorized: false };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mubarak_hostels",
  ...(sslConfig() ? { ssl: sslConfig() } : {}),
  waitForConnections: true,
  connectionLimit: 2,
  dateStrings: true,
});

async function columnExists(table, col) {
  const [rows] = await pool.query("SHOW COLUMNS FROM ?? LIKE ?", [table, col]);
  return rows.length > 0;
}

async function run() {
  // attendance
  if (!(await columnExists("attendance", "recorded_by"))) {
    await pool.query("ALTER TABLE attendance ADD COLUMN recorded_by VARCHAR(255) NULL");
  }
  if (!(await columnExists("attendance", "notes"))) {
    await pool.query("ALTER TABLE attendance ADD COLUMN notes VARCHAR(500) NULL");
  }
  // hostel_rooms
  if (!(await columnExists("hostel_rooms", "amenities"))) {
    await pool.query("ALTER TABLE hostel_rooms ADD COLUMN amenities JSON NULL");
  }
  if (!(await columnExists("hostel_rooms", "description"))) {
    await pool.query("ALTER TABLE hostel_rooms ADD COLUMN description TEXT NULL");
  }
  // expenses
  const [e] = await pool.query("SHOW TABLES LIKE 'expenses'");
  if (!e.length) {
    await pool.query(`
      CREATE TABLE expenses (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        hostel_id INT UNSIGNED NOT NULL,
        purchase_item VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        purpose VARCHAR(100) NULL,
        category VARCHAR(100) NULL,
        expense_date VARCHAR(20) NOT NULL,
        notes TEXT NULL,
        receipt_reference VARCHAR(100) NULL,
        vendor VARCHAR(255) NULL,
        created_by VARCHAR(255) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_expenses_hostel (hostel_id),
        KEY idx_expenses_date (expense_date),
        CONSTRAINT fk_expenses_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }
  console.log("migration complete");
  await pool.end();
}

run().catch((err) => {
  console.error("ERR", err);
  process.exit(1);
});
