"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
  title: string;
  price: number;
  photo_urls_array?: string[];
};

type Order = {
  id: string;
  quantity: number;
  status: "hazırlanıyor" | "kargoya verildi" | "teslim edildi";
  created_at: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  product_id: string;
  user_id: string;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const currentUser = sessionData.user;

      if (!currentUser) {
        router.push("/login");
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (
        orderError ||
        !orderData ||
        !orderData.user_id ||
        orderData.user_id !== currentUser.id
      ) {
        setOrder(null);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      const { data: productData } = await supabase
        .from("products")
        .select("title, price, photo_urls_array")
        .eq("id", orderData.product_id)
        .maybeSingle();

      setProduct(productData || null);
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (!order || !product)
    return (
      <p className="p-6 text-red-500">
        Bu siparişe erişiminiz yok veya ürün bilgisi eksik.
      </p>
    );

  const imageSrc =
    Array.isArray(product.photo_urls_array) &&
    product.photo_urls_array.length > 0 &&
    (product.photo_urls_array[0].startsWith("http") ||
      product.photo_urls_array[0].startsWith("/"))
      ? product.photo_urls_array[0]
      : "/placeholder.png";

  const totalPrice = order.quantity * product.price;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📦 Sipariş Detayı</h1>

      <div className="flex gap-4 items-start">
        <div className="relative w-32 h-32 shrink-0">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover rounded"
            sizes="128px"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <p>Adet: {order.quantity}</p>
          <p>Birim Fiyat: {product.price} ₺</p>
          <p className="font-bold text-rose-600">Toplam: {totalPrice} ₺</p>
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <h3 className="text-lg font-semibold">📄 Teslimat Bilgileri</h3>
        <p>
          <span className="font-medium">Ad Soyad:</span> {order.shipping_name}
        </p>
        <p>
          <span className="font-medium">Telefon:</span> {order.shipping_phone}
        </p>
        <p>
          <span className="font-medium">Adres:</span> {order.shipping_address}
        </p>
      </div>

      <div className="border-t pt-4 space-y-2">
        <h3 className="text-lg font-semibold">📌 Sipariş Durumu</h3>
        <p
          className={`inline-block px-3 py-1 rounded text-sm ${
            order.status === "hazırlanıyor"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "kargoya verildi"
              ? "bg-blue-100 text-blue-800"
              : order.status === "teslim edildi"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </p>
        <p className="text-sm text-gray-500">
          Sipariş Tarihi: {new Date(order.created_at).toLocaleString("tr-TR")}
        </p>
      </div>
    </main>
  );
}
