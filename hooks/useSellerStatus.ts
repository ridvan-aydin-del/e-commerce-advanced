"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useSellerStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSeller = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: sellerData, error } = await supabase
          .from("sellers")
          .select("id")
          .eq("user_id", currentUser.id)
          .maybeSingle(); // ✅ güvenli yöntem

        if (error) {
          console.error("Satıcı sorgusunda hata:", error.message);
        }

        setIsSeller(!!sellerData);
      }

      setLoading(false);
    };

    fetchUserAndSeller();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: sellerData, error } = await supabase
            .from("sellers")
            .select("id")
            .eq("user_id", currentUser.id)
            .maybeSingle(); // ✅ burada da düzeltildi

          if (error) {
            console.error("Auth değişiminde hata:", error.message);
          }

          setIsSeller(!!sellerData);
        } else {
          setIsSeller(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, isSeller, loading };
}
