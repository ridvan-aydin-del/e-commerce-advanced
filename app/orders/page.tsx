"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

type Order = {
  id: string;
  quantity: number;
  status: string;
  created_at: Date;
  products: {
    title: string;
    photo_urls_array?: string[];
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
          products:products!orders_product_id_fkey(title, photo_urls_array, user_id)
        `
        )
        .eq("products.user_id", currentUser.id)
        .order("created_at", { ascending: false })
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

    if (!error) {
      const { data } = await supabase
        .from("orders")
        .select(
          `
          id,
          quantity,
          status,
          created_at,
          products:products!orders_product_id_fkey(title, photo_urls_array, user_id)
        `
        )
        .eq("products.user_id", user.id)
        .order("created_at", { ascending: false })
        .returns<Order[]>();
      setOrders(data ?? []);
    } else {
      alert("Güncelleme başarısız: " + error.message);
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
          {orders.map((order) => {
            const firstPhoto =
              Array.isArray(order.products?.photo_urls_array) &&
              order.products?.photo_urls_array[0]
                ? order.products.photo_urls_array[0]
                : null;

            const imageSrc =
              firstPhoto &&
              (firstPhoto.startsWith("http") || firstPhoto.startsWith("/"))
                ? firstPhoto
                : "/placeholder.png";

            return (
              <li key={order.id} className="border p-4 rounded shadow">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={imageSrc}
                      alt={order.products?.title || "Ürün"}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{order.products?.title}</h2>
                    <p>Adet: {order.quantity}</p>
                    <p>Durum: {order.status}</p>
                    <p className="text-sm text-gray-500">
                      Tarih:{" "}
                      {new Date(order.created_at).toLocaleString("tr-TR")}
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
            );
          })}
        </ul>
      )}
    </div>
  );
}
