"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

// Ürün tipi
type Product = {
  title: string;
  price: number;
  photo_urls_array?: string[];
};

// Supabase'den gelen ham veri tipi
type RawOrder = {
  id: string;
  quantity: number;
  status: string;
  products: Product | null;
};

// Kullanılan gerçek Order tipi
type Order = {
  id: string;
  quantity: number;
  status: "hazırlanıyor" | "kargoya verildi" | "teslim edildi";
  products: Product;
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
          products:products!orders_product_id_fkey(title, price, photo_urls_array)
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Siparişler alınamadı:", error.message);
      } else if (Array.isArray(data)) {
        const cleanedOrders: Order[] = (data as unknown as RawOrder[])
          .map((item): Order | null => {
            const prod = item.products;

            if (
              typeof item.id === "string" &&
              typeof item.quantity === "number" &&
              (item.status === "hazırlanıyor" ||
                item.status === "kargoya verildi" ||
                item.status === "teslim edildi") &&
              prod &&
              typeof prod.title === "string" &&
              typeof prod.price === "number"
            ) {
              return {
                id: item.id,
                quantity: item.quantity,
                status: item.status,
                products: {
                  title: prod.title,
                  price: prod.price,
                  photo_urls_array: Array.isArray(prod.photo_urls_array)
                    ? prod.photo_urls_array
                    : [],
                },
              };
            }

            return null;
          })
          .filter((item): item is Order => item !== null);

        setOrders(cleanedOrders);
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

            const firstPhoto =
              Array.isArray(product.photo_urls_array) &&
              product.photo_urls_array.length > 0
                ? product.photo_urls_array[0]
                : null;

            const imageSrc =
              firstPhoto &&
              (firstPhoto.startsWith("http") || firstPhoto.startsWith("/"))
                ? firstPhoto
                : "/placeholder.png";

            return (
              <li key={order.id} className="border rounded p-4 shadow">
                <Link
                  href={`/my-orders/${order.id}`}
                  className="flex items-center gap-4 hover:bg-gray-50 transition p-2 -m-2 rounded"
                >
                  <div className="relative w-20 h-20 shrink-0">
                    <Image
                      src={imageSrc}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">{product.title}</h2>
                    <p>Adet: {order.quantity}</p>
                    <p>Fiyat: {product.price} ₺</p>
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
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
