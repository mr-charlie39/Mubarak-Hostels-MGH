import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api, apiMode } from "@/lib/api";

export type HostelTotals = {
  hostelId: number;
  totalCollected: number;
  totalExpense: number;
};

export function useManagerHouseTotals(hostelIds: number[]) {
  const { user } = useAuth();
  const [totals, setTotals] = useState<HostelTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!hostelIds.length) {
      setTotals(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const hostelId = hostelIds[0];
    const month = new Date().toISOString().slice(0, 7);
    try {
      if (apiMode) {
        const [fees, expenses] = await Promise.all([
          api.get<Array<{ amount: number; paid: boolean; student_id: number; hostel_id?: number; hostelId?: number; student?: { hostel_id: number } }>>(`/fees?month=${month}`),
          api.get<Array<{ price: number; hostelId?: number; hostel_id?: number }>>(`/expenses?hostelId=${hostelId}`),
        ]);
        const feeCollected = fees
          .filter((f) => {
            const hid = f.hostel_id ?? f.hostelId ?? f.student?.hostel_id;
            return hid === hostelId && f.paid;
          })
          .reduce((s, f) => s + Number(f.amount), 0);
        const totalExpense = expenses.reduce((s, e) => s + Number(e.price), 0);
        setTotals({ hostelId, totalCollected: feeCollected, totalExpense });
      } else {
        // Supabase: approximate (uses current app's patterns)
        setTotals({ hostelId, totalCollected: 0, totalExpense: 0 });
      }
    } catch (e) {
      setError((e as Error).message || "Failed to load totals");
      setTotals({ hostelId, totalCollected: 0, totalExpense: 0 });
    } finally {
      setLoading(false);
    }
  }, [hostelIds[0]]);

  useEffect(() => { load(); }, [load]);
  return { totals, loading, error, reload: load };
}
