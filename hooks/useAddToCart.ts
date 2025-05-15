"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useAddToCart() {
  const router = useRouter();

  const addToCart = async (productId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Lütfen giriş yapın.");

    const { data: existing, error } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle(); // ✅ güvenli hale getirildi

    if (error) {
      console.error("Sepet sorgusu hatası:", error.message);
      return alert("Bir hata oluştu.");
    }

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      });
    }

    router.refresh();
    alert("Ürün sepete eklendi!");
  };

  return { addToCart };
}
