import { supabase } from "@/lib/supabase";
import { api, apiMode } from "@/lib/api";

export type Expense = {
  id: number;
  hostelId: number;
  hostelName?: string | null;
  purchaseItem: string;
  price: number;
  purpose: string | null;
  category: string | null;
  expenseDate: string; // YYYY-MM-DD
  notes: string | null;
  receiptReference: string | null;
  vendor: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ExpenseInput = {
  hostelId: number;
  purchaseItem: string;
  price: number;
  purpose?: string | null;
  category?: string | null;
  expenseDate: string;
  notes?: string | null;
  receiptReference?: string | null;
  vendor?: string | null;
};

export type ExpenseFilters = {
  hostelId?: number | null;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  category?: string | null;
};

type ExpenseRow = {
  id: number;
  hostel_id: number;
  hostel_name?: string | null;
  purchase_item: string;
  price: string | number;
  purpose: string | null;
  category: string | null;
  expense_date: string;
  notes: string | null;
  receipt_reference: string | null;
  vendor: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
};

function mapRow(r: ExpenseRow): Expense {
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

function toRow(input: ExpenseInput) {
  return {
    hostel_id: input.hostelId,
    purchase_item: input.purchaseItem,
    price: input.price,
    purpose: input.purpose ?? null,
    category: input.category ?? null,
    expense_date: input.expenseDate,
    notes: input.notes ?? null,
    receipt_reference: input.receiptReference ?? null,
    vendor: input.vendor ?? null,
  };
}

export async function fetchExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
  if (apiMode) {
    const qs = new URLSearchParams();
    if (filters.hostelId) qs.set("hostelId", String(filters.hostelId));
    if (filters.from) qs.set("from", filters.from);
    if (filters.to) qs.set("to", filters.to);
    if (filters.category) qs.set("category", filters.category);
    const rows = await api.get<ExpenseRow[]>(`/expenses${qs.toString() ? `?${qs}` : ""}`);
    return rows.map(mapRow);
  }
  let q = supabase
    .from("expenses")
    .select("*, hostels(name)")
    .order("expense_date", { ascending: false });
  if (filters.hostelId) q = q.eq("hostel_id", filters.hostelId);
  if (filters.from) q = q.gte("expense_date", filters.from);
  if (filters.to) q = q.lte("expense_date", filters.to);
  if (filters.category) q = q.eq("category", filters.category);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return ((data ?? []) as (ExpenseRow & { hostels?: { name: string } | null })[]).map((r) => ({
    ...mapRow(r),
    hostelName: r.hostels?.name ?? null,
  }));
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  if (apiMode) {
    return api.post<Expense>("/expenses", input);
  }
  const { data, error } = await supabase
    .from("expenses")
    .insert(toRow(input))
    .select("*, hostels(name)")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Could not create the expense.");
  const row = data as ExpenseRow & { hostels?: { name: string } | null };
  return { ...mapRow(row), hostelName: row.hostels?.name ?? null };
}

export async function updateExpense(id: number, input: ExpenseInput): Promise<Expense> {
  if (apiMode) {
    return api.put<Expense>(`/expenses/${id}`, input);
  }
  const { data, error } = await supabase
    .from("expenses")
    .update(toRow(input))
    .eq("id", id)
    .select("*, hostels(name)")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Expense not found.");
  const row = data as ExpenseRow & { hostels?: { name: string } | null };
  return { ...mapRow(row), hostelName: row.hostels?.name ?? null };
}

export async function deleteExpense(id: number): Promise<void> {
  if (apiMode) {
    await api.del(`/expenses/${id}`);
    return;
  }
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export const EXPENSE_CATEGORIES = [
  "Mess",
  "Utility Bills",
  "Salaries",
  "General",
  "Gas",
  "Electricity",
] as const;

export function formatRupees(n: number): string {
  return `PKR ${Math.round(n).toLocaleString()}`;
}
