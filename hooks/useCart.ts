"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase
          .from("cart_items")
          .select(
            "id, quantity, product_id, products(title, price, stock, image_url)"
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
