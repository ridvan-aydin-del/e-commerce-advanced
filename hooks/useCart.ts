"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      if (currentUser) {
        const { data, error } = await supabase
          .from("cart_items")
          .select(
            "id, quantity, product_id, products(title, price, stock, photo_urls_array)"
          )
          .eq("user_id", currentUser.id);

        if (!error && data) {
          setCartItems(data);
        }
      }
    };

    fetchCart();
  }, []);

  return { cartItems };
}
