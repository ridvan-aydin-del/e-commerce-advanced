"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const [submitted, setSubmitted] = useState(false);
  const { cartItems } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.products.price * item.quantity;
  }, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Sepet boş.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      alert("Lütfen giriş yapın.");
      return;
    }

    // 1. Siparişleri ekle
    const ordersToInsert = cartItems.map((item) => ({
      user_id: currentUser.id,
      product_id: item.product_id,
      quantity: item.quantity,
      status: "hazırlanıyor",
    }));

    const { error: insertError } = await supabase
      .from("orders")
      .insert(ordersToInsert);

    if (insertError) {
      console.error("🟥 Sipariş eklenemedi:", insertError.message);
      alert("Sipariş kaydedilemedi.");
      return;
    } else {
      console.log("✅ Siparişler eklendi:", ordersToInsert);
    }

    // 2. Stokları güncelle
    for (const item of cartItems) {
      const currentStock = item.products.stock;
      const productId = item.product_id;
      const quantity = item.quantity;

      console.log("🛒 Ürün:", item.products.title);
      console.log("📦 Mevcut stok:", currentStock);
      console.log("➖ Sipariş edilen miktar:", quantity);

      if (typeof currentStock !== "number") {
        console.error("🟥 Stok bilgisi okunamadı:", item);
        continue;
      }

      const newStock = Math.max(currentStock - quantity, 0);
      console.log("✅ Güncellenecek stok:", newStock);

      const { error: updateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", productId);

      if (updateError) {
        console.error("🟥 Stok güncellenemedi:", updateError.message);
      } else {
        console.log(
          `✅ ${item.products.title} için stok güncellendi: ${newStock}`
        );
      }
    }

    // 3. Sepeti temizle
    await supabase.from("cart_items").delete().eq("user_id", currentUser.id);
    console.log("🗑️ Sepet temizlendi");

    setSubmitted(true);
  };

  return (
    <main className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Ödeme Ekranı</h1>
      {submitted ? (
        <p className="text-green-600 text-center text-lg">
          ✅ Ödeme başarıyla alındı! Siparişiniz hazırlanıyor 🚚
        </p>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <h1>Toplam Tutar: {totalPrice.toFixed(2)} ₺</h1>
          <input
            type="text"
            placeholder="Kart Numarası"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Son Kullanma Tarihi"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="CVC"
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            Ödemeyi Yap
          </button>
        </form>
      )}
    </main>
  );
}
