"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Order = {
  id: string;
  quantity: number;
  status: string;
  created_at: Date;
  products: {
    title: string;
    image_url?: string;
    user_id: string;
  };
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      if (!currentUser) return;
      setUser(currentUser);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          quantity,
          status,
          created_at,
          products:products!orders_product_id_fkey(title, image_url, user_id)
        `
        )
        .eq("products.user_id", currentUser.id)
        .order("created_at", { ascending: false }) // en yeniler en üstte
        .returns<Order[]>();

      if (error) {
        console.error("Siparişler alınamadı:", error.message);
      } else {
        setOrders(data ?? []);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Güncelleme başarısız: " + error.message);
    } else {
      // yeniden sipariş listesini çek
      const { data } = await supabase
        .from("orders")
        .select(
          `
        id,
        quantity,
        status,
        created_at,
        products:products!orders_product_id_fkey(title, image_url, user_id)
      `
        )
        .eq("products.user_id", user.id)
        .order("created_at", { ascending: false })
        .returns<Order[]>();
      setOrders(data ?? []);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ürünlerine Gelen Siparişler</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : orders.length === 0 ? (
        <p>Henüz sipariş yok.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded shadow">
              <div className="flex items-center gap-4">
                <img
                  src={order.products?.image_url || "/placeholder.png"}
                  alt={order.products?.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{order.products?.title}</h2>
                  <p>Adet: {order.quantity}</p>
                  <p>Durum: {order.status}</p>
                  <p className="text-sm text-gray-500">
                    Tarih: {new Date(order.created_at).toLocaleString("tr-TR")}
                  </p>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="mt-2 border p-1 rounded"
                  >
                    <option value="hazırlanıyor">Hazırlanıyor</option>
                    <option value="kargoya verildi">Kargoya Verildi</option>
                    <option value="teslim edildi">Teslim Edildi</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
