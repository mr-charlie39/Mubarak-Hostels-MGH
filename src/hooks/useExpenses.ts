import { useCallback, useEffect, useState } from "react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  type Expense,
  type ExpenseInput,
  type ExpenseFilters,
} from "@/lib/expensesDb";

export function useExpenses(filters: ExpenseFilters = {}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const key = JSON.stringify(filters);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const parsed = JSON.parse(key) as ExpenseFilters;
      setExpenses(await fetchExpenses(parsed));
    } catch (e) {
      setError((e as Error).message || "Could not load expenses. Please try again.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    void load();
  }, [load]);

  const add = useCallback(
    async (input: ExpenseInput) => {
      const created = await createExpense(input);
      setExpenses((prev) =>
        [created, ...prev].sort((a, b) =>
          b.expenseDate.localeCompare(a.expenseDate) || b.id - a.id,
        ),
      );
      return created;
    },
    [],
  );

  const edit = useCallback(async (id: number, input: ExpenseInput) => {
    const updated = await updateExpense(id, input);
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const remove = useCallback(async (id: number) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { expenses, loading, error, reload: load, add, edit, remove };
}
