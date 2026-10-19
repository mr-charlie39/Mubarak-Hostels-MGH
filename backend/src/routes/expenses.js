import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { audit } from "../notify.js";

// House/property expense management.
//   GET    /api/expenses?hostelId=&from=&to=&category= -> Expense[]
//   POST   /api/expenses                               -> create
//   PUT    /api/expenses/:id                           -> update
//   DELETE /api/expenses/:id                           -> delete
//
// Wardens (managers) are scoped to their own hostel: they can only list,
// create, edit and delete expenses for the house they manage. Admins can
// access every hostel and filter by hostelId.
const router = Router();
router.use(requireAuth);

async function meRow(req) {
  const [rows] = await pool.query(
    "SELECT id, name, role, hostel_id FROM users WHERE id = ?",
    [req.user.id]
  );
  return rows[0] ?? { id: req.user.id, name: null, role: req.user.role, hostel_id: null };
}

function mapRow(r) {
  return {
    id: Number(r.id),
    hostelId: Number(r.hostel_id),
    hostelName: r.hostel_name ?? null,
    purchaseItem: r.purchase_item,
    price: Number(r.price),
    purpose: r.purpose ?? null,
    category: r.category ?? null,
    expenseDate: r.expense_date,
    notes: r.notes ?? null,
    receiptReference: r.receipt_reference ?? null,
    vendor: r.vendor ?? null,
    createdBy: r.created_by ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at ?? null,
  };
}

const BASE_SELECT = `
  SELECT e.*, h.name AS hostel_name
  FROM expenses e
  LEFT JOIN hostels h ON h.id = e.hostel_id
`;

// GET /api/expenses
router.get("/", async (req, res) => {
  try {
    const me = await meRow(req);
    const where = [];
    const params = [];

    if (me.role === "warden") {
      where.push("e.hostel_id = ?");
      params.push(me.hostel_id);
    } else if (req.query.hostelId) {
      where.push("e.hostel_id = ?");
      params.push(Number(req.query.hostelId));
    }
    if (req.query.from) {
      where.push("e.expense_date >= ?");
      params.push(String(req.query.from));
    }
    if (req.query.to) {
      where.push("e.expense_date <= ?");
      params.push(String(req.query.to));
    }
    if (req.query.category) {
      where.push("e.category = ?");
      params.push(String(req.query.category));
    }

    const sql = `${BASE_SELECT}${where.length ? " WHERE " + where.join(" AND ") : ""} ORDER BY e.expense_date DESC, e.id DESC`;
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(mapRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function validateBody(b, me) {
  const purchaseItem = String(b.purchaseItem ?? b.purchase_item ?? "").trim();
  if (!purchaseItem) return { error: "Purchase/item name is required." };
  const price = Number(b.price);
  if (!Number.isFinite(price) || price < 0) return { error: "A valid price/amount is required." };
  const expenseDate = String(b.expenseDate ?? b.expense_date ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)) {
    return { error: "A valid expense date (YYYY-MM-DD) is required." };
  }
  let hostelId = Number(b.hostelId ?? b.hostel_id);
  if (me.role === "warden") {
    hostelId = Number(me.hostel_id);
    if (!hostelId) return { error: "Your account is not assigned to a house yet." };
  }
  if (!hostelId) return { error: "A house/hostel is required." };
  return {
    values: {
      hostelId,
      purchaseItem,
      price,
      purpose: b.purpose ? String(b.purpose).trim().slice(0, 255) : null,
      category: b.category ? String(b.category).trim().slice(0, 100) : null,
      expenseDate,
      notes: b.notes ? String(b.notes).trim().slice(0, 2000) : null,
      receiptReference: b.receiptReference ?? b.receipt_reference
        ? String(b.receiptReference ?? b.receipt_reference).trim().slice(0, 100)
        : null,
      vendor: b.vendor ? String(b.vendor).trim().slice(0, 255) : null,
    },
  };
}

// POST /api/expenses
router.post("/", async (req, res) => {
  try {
    const me = await meRow(req);
    const checked = validateBody(req.body ?? {}, me);
    if (checked.error) return res.status(400).json({ error: checked.error });
    const v = checked.values;

    const [result] = await pool.query(
      `INSERT INTO expenses
         (hostel_id, purchase_item, price, purpose, category, expense_date, notes, receipt_reference, vendor, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.hostelId,
        v.purchaseItem,
        v.price,
        v.purpose,
        v.category,
        v.expenseDate,
        v.notes,
        v.receiptReference,
        v.vendor,
        me.name ?? null,
      ]
    );

    void audit({
      user: { id: me.id, name: me.name, role: me.role },
      action: "expense.created",
      resource: "expenses",
      resource_id: String(result.insertId),
      details: `${v.purchaseItem} — PKR ${v.price} (${v.category ?? "uncategorised"})`,
    });

    const [rows] = await pool.query(`${BASE_SELECT} WHERE e.id = ?`, [result.insertId]);
    res.status(201).json(mapRow(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ensure a warden can only touch expenses inside their own hostel.
async function mayManage(me, expenseId) {
  const [rows] = await pool.query("SELECT hostel_id FROM expenses WHERE id = ?", [expenseId]);
  if (!rows.length) return { ok: false, status: 404, error: "Expense not found." };
  if (me.role === "admin") return { ok: true, hostelId: Number(rows[0].hostel_id) };
  if (me.role === "warden" && Number(rows[0].hostel_id) === Number(me.hostel_id)) {
    return { ok: true, hostelId: Number(rows[0].hostel_id) };
  }
  return { ok: false, status: 403, error: "You cannot modify expenses outside your house." };
}

// PUT /api/expenses/:id
router.put("/:id", async (req, res) => {
  try {
    const me = await meRow(req);
    const id = Number(req.params.id);
    const allowed = await mayManage(me, id);
    if (!allowed.ok) return res.status(allowed.status).json({ error: allowed.error });

    const checked = validateBody(req.body ?? {}, me);
    if (checked.error) return res.status(400).json({ error: checked.error });
    const v = checked.values;

    await pool.query(
      `UPDATE expenses
         SET hostel_id = ?, purchase_item = ?, price = ?, purpose = ?, category = ?,
             expense_date = ?, notes = ?, receipt_reference = ?, vendor = ?
       WHERE id = ?`,
      [
        v.hostelId,
        v.purchaseItem,
        v.price,
        v.purpose,
        v.category,
        v.expenseDate,
        v.notes,
        v.receiptReference,
        v.vendor,
        id,
      ]
    );

    void audit({
      user: { id: me.id, name: me.name, role: me.role },
      action: "expense.updated",
      resource: "expenses",
      resource_id: String(id),
      details: `${v.purchaseItem} — PKR ${v.price}`,
    });

    const [rows] = await pool.query(`${BASE_SELECT} WHERE e.id = ?`, [id]);
    res.json(mapRow(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/expenses/:id
router.delete("/:id", async (req, res) => {
  try {
    const me = await meRow(req);
    const id = Number(req.params.id);
    const allowed = await mayManage(me, id);
    if (!allowed.ok) return res.status(allowed.status).json({ error: allowed.error });

    const [rows] = await pool.query("SELECT purchase_item, price FROM expenses WHERE id = ?", [id]);
    await pool.query("DELETE FROM expenses WHERE id = ?", [id]);

    void audit({
      user: { id: me.id, name: me.name, role: me.role },
      action: "expense.deleted",
      resource: "expenses",
      resource_id: String(id),
      details: rows[0] ? `${rows[0].purchase_item} — PKR ${rows[0].price}` : null,
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
