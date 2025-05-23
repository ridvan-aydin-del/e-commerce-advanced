"use client";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Cart = {
  id: string;
  quantity: number;
  product_id: string;
  user_id: string;
  products: {
    title: string;
    price: number;
    photo_urls_array?: string[];
  };
};

const Cart = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartItem, setCartItem] = useState<Cart[]>([]);

  const fetchCart = async (userId: string) => {
    const { data: cartData, error } = await supabase
      .from("cart_items")
      .select(
        "id, quantity, product_id, user_id, products(title, price, photo_urls_array)"
      )
      .eq("user_id", userId)
      .returns<Cart[]>();

    if (error) {
      console.error("Sepet verisi alınamadı:", error.message);
    }

    setCartItem(cartData || []);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      setUser(currentUser);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user]);

  const increaseQuantity = async (itemId: string, currentQuantity: number) => {
    await supabase
      .from("cart_items")
      .update({ quantity: currentQuantity + 1 })
      .eq("id", itemId);

    if (user) {
      fetchCart(user.id);
    }
  };

  const decreaseQuantity = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      await supabase.from("cart_items").delete().eq("id", itemId);
    } else {
      await supabase
        .from("cart_items")
        .update({ quantity: currentQuantity - 1 })
        .eq("id", itemId);
    }
    if (user) {
      fetchCart(user.id);
    }
  };

  const deleteItem = async (itemId: string) => {
    await supabase.from("cart_items").delete().eq("id", itemId);
    if (user) {
      fetchCart(user.id);
    }
  };

  const totalPrice = cartItem.reduce((sum, item) => {
    return sum + item.products.price * item.quantity;
  }, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sepetim</h1>
      {cartItem.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <ul className="space-y-4">
          {cartItem.map((item) => {
            const firstPhoto =
              Array.isArray(item.products.photo_urls_array) &&
              item.products.photo_urls_array[0]
                ? item.products.photo_urls_array[0]
                : null;

            const imageSrc =
              firstPhoto &&
              (firstPhoto.startsWith("http") || firstPhoto.startsWith("/"))
                ? firstPhoto
                : "/placeholder.png";

            return (
              <li
                key={item.id}
                className="border p-4 rounded shadow flex gap-4 items-center"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={imageSrc}
                    alt={item.products.title}
                    fill
                    className="object-cover rounded"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.products.title}</p>
                  <p>{item.products.price} ₺</p>
                  <p>Adet: {item.quantity}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.quantity)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="px-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id, item.quantity)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600 transition ml-2"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {cartItem.length > 0 && (
        <>
          <div className="mt-6 text-right">
            <h2 className="text-xl font-semibold">
              Toplam Tutar:{" "}
              <span className="text-rose-600">{totalPrice.toFixed(2)} ₺</span>
            </h2>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => router.push("/checkout")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Siparişi Tamamla
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
