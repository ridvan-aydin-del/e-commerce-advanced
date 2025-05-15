"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Order = {
  id: string;
  quantity: number;
  status: string;
  products: {
    title: string;
    price: number;
    image_url?: string;
  }; // ✅ artık dizi değil, tekil nesne
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
    id,
    quantity,
    status,
    products:products!orders_product_id_fkey(title, price, image_url)
  `
        )
        .eq("user_id", user.id)
        .returns<Order[]>(); // ✅ bu satır eklendi

      if (error) {
        console.error("Siparişler alınamadı:", error.message);
      } else {
        setOrders(data ?? []);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Siparişlerim</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : orders.length === 0 ? (
        <p>Henüz bir siparişiniz yok.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const product = order.products;
            return (
              <li key={order.id} className="border rounded p-4 shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={product?.image_url || "/placeholder.png"}
                    alt={product?.title || "Ürün resmi"}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold">
                      {product?.title || "Ürün bilgisi eksik"}
                    </h2>
                    <p>Adet: {order.quantity}</p>
                    <p>Fiyat: {product?.price ?? "?"} ₺</p>
                    <p
                      className={`text-sm font-medium px-2 py-1 rounded inline-block ${
                        order.status === "hazırlanıyor"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "kargoya verildi"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "teslim edildi"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      Durum: {order.status}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
