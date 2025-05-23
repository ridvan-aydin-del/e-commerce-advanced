"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    title: string;
    price: number;
  };
};

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData.user;
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      const { data: cartData, error } = await supabase
        .from("cart_items")
        .select("id, quantity, product_id, products(title, price)")
        .eq("user_id", currentUser.id);

      if (error) {
        console.error("Sepet verisi alınamadı:", error.message);
        setLoading(false);
        return;
      }

      const normalized =
        cartData?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          product_id: item.product_id,
          products: Array.isArray(item.products)
            ? item.products[0]
            : item.products,
        })) || [];

      setCartItems(normalized);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || cartItems.length === 0) return;

    const orderInserts = cartItems.map((item) => ({
      user_id: user.id,
      product_id: item.product_id,
      quantity: item.quantity,
      status: "hazırlanıyor",
      shipping_name: form.name,
      shipping_phone: form.phone,
      shipping_address: form.address,
    }));

    const { error: insertError } = await supabase
      .from("orders")
      .insert(orderInserts);

    if (insertError) {
      alert("Sipariş oluşturulamadı: " + insertError.message);
      return;
    }

    await supabase.from("cart_items").delete().eq("user_id", user.id);

    setSuccess(true);
    setCartItems([]);
    setForm({
      name: "",
      phone: "",
      address: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
    });
  };

  if (loading) return <p className="p-6">Yükleniyor...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Siparişi Tamamla</h1>

      {success ? (
        <div className="bg-green-100 text-green-800 p-4 rounded text-center">
          ✅ Siparişiniz başarıyla alındı!
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="border p-3 rounded">
                {item.products.title} x {item.quantity} —{" "}
                {(item.products.price * item.quantity).toFixed(2)} ₺
              </li>
            ))}
          </ul>

          <p className="text-right font-semibold text-lg">
            Toplam: {totalPrice.toFixed(2)} ₺
          </p>

          <form onSubmit={handleOrder} className="space-y-4 mt-6">
            <div>
              <label className="block font-medium">Ad Soyad</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Telefon</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Adres</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                rows={3}
                required
              />
            </div>

            <hr className="my-4" />

            <h2 className="font-semibold">💳 Sahte Kart Bilgileri</h2>
            <div>
              <label className="block font-medium">Kart Numarası</label>
              <input
                type="text"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="4242 4242 4242 4242"
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium">Son Kullanma</label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={form.cardExpiry}
                  onChange={handleChange}
                  placeholder="12/26"
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium">CVC</label>
                <input
                  type="text"
                  name="cardCVC"
                  value={form.cardCVC}
                  onChange={handleChange}
                  placeholder="123"
                  className="border p-2 w-full rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full"
            >
              Ödeme Yap & Siparişi Tamamla
            </button>
          </form>
        </>
      )}
    </main>
  );
}
