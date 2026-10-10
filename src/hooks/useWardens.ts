import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api, apiMode, resolveImageUrl } from "@/lib/api";

export type PublicWarden = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  hostelId: number | null;
  avatarUrl: string | null;
  position: string | null;
};

export function useWardens() {
  const [wardens, setWardens] = useState<PublicWarden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (apiMode) {
        const rows = await api.get<
          Array<{
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            hostelId: number | null;
            avatarUrl: string | null;
            position: string | null;
          }>
        >("/public/wardens");
        setWardens(
          rows.map((w) => ({
            ...w,
            avatarUrl: resolveImageUrl(w.avatarUrl) ?? null,
          }))
        );
        return;
      }
      const { data, error: err } = await supabase
        .from("profiles")
        .select("id, name, email, phone, hostel_id, avatar_url, position")
        .eq("role", "warden")
        .order("name");
      if (err) {
        setError(err.message);
        setWardens([]);
      } else {
        setWardens(
          ((data ?? []) as {
            id: string;
            name: string | null;
            email: string | null;
            phone: string | null;
            hostel_id: number | null;
            avatar_url: string | null;
            position: string | null;
          }[]).map((w) => ({
            id: w.id,
            name: w.name ?? "Manager",
            email: w.email,
            phone: w.phone,
            hostelId: w.hostel_id,
            avatarUrl: resolveImageUrl(w.avatar_url) ?? null,
            position: w.position ?? "Manager",
          }))
        );
      }
    } catch (e) {
      setError((e as Error).message || "Could not load managers.");
      setWardens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const forHostel = useCallback(
    (hostelId: number | null) => wardens.find((w) => w.hostelId === hostelId) ?? null,
    [wardens]
  );

  return { wardens, loading, error, reload: load, forHostel };
}