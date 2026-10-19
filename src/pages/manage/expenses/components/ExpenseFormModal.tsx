import { useState } from "react";
import { useHostels } from "@/hooks/useHostels";
import { EXPENSE_CATEGORIES, type ExpenseInput } from "@/lib/expensesDb";

export type ExpenseFormValues = ExpenseInput;

type Props = {
  mode: "create" | "edit";
  initial?: Partial<ExpenseInput>;
  lockedHostelId?: number | null;
  saving: boolean;
  error: string;
  onSubmit: (values: ExpenseFormValues) => void;
  onClose: () => void;
};

export default function ExpenseFormModal({
  mode,
  initial,
  lockedHostelId,
  saving,
  error,
  onSubmit,
  onClose,
}: Props) {
  const { hostels } = useHostels();
  const [purchaseItem, setPurchaseItem] = useState(initial?.purchaseItem ?? "");
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [purpose, setPurpose] = useState(initial?.purpose ?? "");
  const [expenseDate, setExpenseDate] = useState(
    initial?.expenseDate ?? new Date().toISOString().slice(0, 10),
  );
  const [vendor, setVendor] = useState(initial?.vendor ?? "");
  const [receiptReference, setReceiptReference] = useState(initial?.receiptReference ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [hostelId, setHostelId] = useState<number | "">(
    lockedHostelId ?? initial?.hostelId ?? "",
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      hostelId: Number(hostelId),
      purchaseItem: purchaseItem.trim(),
      price: Number(price),
      category: category.trim() || null,
      purpose: purpose.trim() || null,
      expenseDate,
      vendor: vendor.trim() || null,
      receiptReference: receiptReference.trim() || null,
      notes: notes.trim() || null,
    });
  };

  const priceNum = Number(price);
  const canSubmit =
    purchaseItem.trim().length > 0 &&
    Number.isFinite(priceNum) &&
    priceNum >= 0 &&
    price !== "" &&
    /^\d{4}-\d{2}-\d{2}$/.test(expenseDate) &&
    (lockedHostelId != null || hostelId !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground-950/40" onClick={onClose}></div>
      <div className="relative bg-background-50 border border-background-200 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold text-foreground-900">
            {mode === "create" ? "Add Expense" : "Edit Expense"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer transition"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {lockedHostelId == null && (
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                House / Property
              </label>
              <select
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
              >
                <option value="">Select a house…</option>
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                Purchase / Item name <span className="text-accent-600">*</span>
              </label>
              <input
                type="text"
                value={purchaseItem}
                onChange={(e) => setPurchaseItem(e.target.value)}
                maxLength={255}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. Water pump repair"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                Price / Amount (PKR) <span className="text-accent-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. 4500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
              >
                <option value="">Select a category…</option>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                Date <span className="text-accent-600">*</span>
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">
              Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={255}
              className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="e.g. Monthly electricity bill"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                Vendor / Supplier <span className="text-foreground-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                maxLength={255}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. Karachi Electric"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-800 mb-1.5">
                Receipt reference <span className="text-foreground-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={receiptReference}
                onChange={(e) => setReceiptReference(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. INV-2026-0142"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-1.5">
              Notes <span className="text-foreground-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={2000}
              className="w-full px-3 py-2.5 rounded-md border border-background-300 bg-background-50 text-foreground-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
              placeholder="Any additional details…"
            />
          </div>

          {error && (
            <div className="text-sm text-accent-700 bg-accent-100 rounded-md px-3 py-2">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-foreground-600 hover:bg-background-100 whitespace-nowrap cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="px-5 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold whitespace-nowrap cursor-pointer transition disabled:opacity-60"
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-1.5"></i>
                  Saving…
                </>
              ) : mode === "create" ? (
                "Add Expense"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
