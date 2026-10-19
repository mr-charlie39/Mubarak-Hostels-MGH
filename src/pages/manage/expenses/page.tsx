import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useHostels } from "@/hooks/useHostels";
import { useExpenses } from "@/hooks/useExpenses";
import {
  EXPENSE_CATEGORIES,
  formatRupees,
  type Expense,
  type ExpenseInput,
} from "@/lib/expensesDb";
import ExpenseFormModal from "./components/ExpenseFormModal";
import ConfirmDialog from "@/pages/manage/students/components/ConfirmDialog";
import DataState from "@/pages/manage/components/DataState";

function monthStr(offset = 0): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return d.toISOString().slice(0, 7); // YYYY-MM
}

export default function Expenses() {
  const { user } = useAuth();
  const { hostels } = useHostels();
  const isWarden = user?.role === "warden";
  const wardenHostelId = isWarden ? (user?.hostelId ?? null) : null;

  const [month, setMonth] = useState<string>(monthStr());
  const [categoryFilter, setCategoryFilter] = useState("");
  const [hostelFilter, setHostelFilter] = useState<number | "">("");

  const filters = useMemo(
    () => ({
      hostelId: wardenHostelId ?? (hostelFilter === "" ? null : hostelFilter),
      from: month ? `${month}-01` : undefined,
      to: month ? `${month}-31` : undefined,
      category: categoryFilter || null,
    }),
    [wardenHostelId, hostelFilter, month, categoryFilter],
  );

  const { expenses, loading, error, reload, add, edit, remove } = useExpenses(filters);

  const [modal, setModal] = useState<{ open: boolean; editing: Expense | null }>({
    open: false,
    editing: null,
  });
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [flash, setFlash] = useState("");

  const showToast = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(""), 3500);
  };

  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.price, 0);
    const byCategory = new Map<string, number>();
    for (const e of expenses) {
      const key = e.category || "Uncategorised";
      byCategory.set(key, (byCategory.get(key) ?? 0) + e.price);
    }
    const top = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total,
      count: expenses.length,
      categories: byCategory.size,
      topCategory: top ? top[0] : "—",
      topAmount: top ? top[1] : 0,
    };
  }, [expenses]);

  const hostelName = (id: number) => hostels.find((h) => h.id === id)?.name ?? `House #${id}`;

  const handleSubmit = async (values: ExpenseInput) => {
    setSaving(true);
    setActionError("");
    try {
      if (modal.editing) {
        await edit(modal.editing.id, values);
        showToast(`Expense "${values.purchaseItem}" updated.`);
      } else {
        await add(values);
        showToast(`Expense "${values.purchaseItem}" added.`);
      }
      setModal({ open: false, editing: null });
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setActionError("");
    try {
      await remove(deleting.id);
      showToast(`Expense "${deleting.purchaseItem}" deleted.`);
      setDeleting(null);
    } catch (e) {
      setActionError((e as Error).message);
    }
  };

  const monthLabel = month
    ? new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "All time";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Expenses</h1>
          <p className="text-sm text-foreground-600 mt-1">
            {isWarden
              ? "Track purchases and spending for your house."
              : "Track purchases and spending across all houses."}
          </p>
        </div>
        <button
          onClick={() => {
            setActionError("");
            setModal({ open: true, editing: null });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold whitespace-nowrap cursor-pointer transition"
        >
          <i className="ri-add-line text-lg"></i>
          Add Expense
        </button>
      </div>

      {flash && (
        <div className="text-sm text-primary-800 bg-primary-100 border border-primary-200 rounded-md px-4 py-3">
          {flash}
        </div>
      )}
      {actionError && !modal.open && (
        <div className="text-sm text-accent-700 bg-accent-100 rounded-md px-4 py-3">{actionError}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 bg-background-50 border border-background-200 rounded-xl p-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-400 mb-1">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-400 mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
          >
            <option value="">All categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {!isWarden && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-foreground-400 mb-1">
              House
            </label>
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value === "" ? "" : Number(e.target.value))}
              className="px-3 py-2 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
            >
              <option value="">All houses</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {(month !== monthStr() || categoryFilter || hostelFilter !== "") && (
          <button
            onClick={() => {
              setMonth(monthStr());
              setCategoryFilter("");
              setHostelFilter("");
            }}
            className="px-3 py-2 rounded-md text-sm text-foreground-600 hover:bg-background-100 cursor-pointer transition"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <div className="text-xs text-foreground-500">Total spent — {monthLabel}</div>
          <div className="font-heading text-xl font-bold text-foreground-950 mt-1">
            {formatRupees(stats.total)}
          </div>
        </div>
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <div className="text-xs text-foreground-500">Entries</div>
          <div className="font-heading text-xl font-bold text-foreground-950 mt-1">{stats.count}</div>
        </div>
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <div className="text-xs text-foreground-500">Categories used</div>
          <div className="font-heading text-xl font-bold text-foreground-950 mt-1">
            {stats.categories}
          </div>
        </div>
        <div className="bg-background-50 border border-background-200 rounded-xl p-4">
          <div className="text-xs text-foreground-500">Top category</div>
          <div className="font-heading text-base font-bold text-foreground-950 mt-1 truncate">
            {stats.topCategory}
          </div>
          <div className="text-xs text-foreground-500 mt-0.5">{formatRupees(stats.topAmount)}</div>
        </div>
      </div>

      {/* Table */}
      <DataState loading={loading} error={error} onRetry={reload}>
        {expenses.length === 0 ? (
          <div className="py-16 text-center text-foreground-500 bg-background-50 border border-background-200 rounded-xl">
            <i className="ri-money-cny-circle-line text-4xl block mb-3"></i>
            <p className="text-sm">No expenses recorded for {monthLabel}.</p>
            <button
              onClick={() => setModal({ open: true, editing: null })}
              className="mt-4 px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold whitespace-nowrap cursor-pointer transition"
            >
              Add the first expense
            </button>
          </div>
        ) : (
          <div className="bg-background-50 border border-background-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-background-200 text-left text-xs uppercase tracking-wide text-foreground-400">
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                    <th className="px-4 py-3 font-semibold">Vendor</th>
                    <th className="px-4 py-3 font-semibold">Receipt</th>
                    {!isWarden && <th className="px-4 py-3 font-semibold">House</th>}
                    <th className="px-4 py-3 font-semibold text-right">Amount</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-background-100 last:border-0 hover:bg-background-100/60 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-foreground-700">
                        {new Date(`${e.expenseDate}T00:00:00`).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground-900">{e.purchaseItem}</td>
                      <td className="px-4 py-3">
                        {e.category ? (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-800 text-xs font-semibold whitespace-nowrap">
                            {e.category}
                          </span>
                        ) : (
                          <span className="text-foreground-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground-600 max-w-[200px] truncate" title={e.purpose ?? ""}>
                        {e.purpose || "—"}
                      </td>
                      <td className="px-4 py-3 text-foreground-600">{e.vendor || "—"}</td>
                      <td className="px-4 py-3 text-foreground-600 font-mono text-xs">
                        {e.receiptReference || "—"}
                      </td>
                      {!isWarden && (
                        <td className="px-4 py-3 text-foreground-600 whitespace-nowrap">
                          {hostelName(e.hostelId)}
                        </td>
                      )}
                      <td className="px-4 py-3 text-right font-semibold text-foreground-950 whitespace-nowrap">
                        {formatRupees(e.price)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => {
                              setActionError("");
                              setModal({ open: true, editing: e });
                            }}
                            title="Edit"
                            className="w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 cursor-pointer transition"
                          >
                            <i className="ri-pencil-line"></i>
                          </button>
                          <button
                            onClick={() => {
                              setActionError("");
                              setDeleting(e);
                            }}
                            title="Delete"
                            className="w-8 h-8 flex items-center justify-center rounded-md text-accent-700 hover:bg-accent-50 cursor-pointer transition"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-background-100 font-semibold text-foreground-950">
                    <td className="px-4 py-3" colSpan={isWarden ? 7 : 8}>
                      Total
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{formatRupees(stats.total)}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </DataState>

      {/* Create / edit modal */}
      {modal.open && (
        <ExpenseFormModal
          mode={modal.editing ? "edit" : "create"}
          initial={
            modal.editing
              ? {
                  hostelId: modal.editing.hostelId,
                  purchaseItem: modal.editing.purchaseItem,
                  price: modal.editing.price,
                  category: modal.editing.category ?? "",
                  purpose: modal.editing.purpose ?? "",
                  expenseDate: modal.editing.expenseDate,
                  vendor: modal.editing.vendor ?? "",
                  receiptReference: modal.editing.receiptReference ?? "",
                  notes: modal.editing.notes ?? "",
                }
              : { hostelId: wardenHostelId ?? undefined }
          }
          lockedHostelId={wardenHostelId}
          saving={saving}
          error={actionError}
          onSubmit={handleSubmit}
          onClose={() => setModal({ open: false, editing: null })}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        title="Delete expense?"
        message={
          deleting
            ? `This will permanently remove "${deleting.purchaseItem}" (${formatRupees(deleting.price)}) from the records.`
            : ""
        }
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
