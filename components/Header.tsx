"use client";
import Link from "next/link";
import React from "react";
import { useSellerStatus } from "@/hooks/useSellerStatus";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, isSeller, loading } = useSellerStatus();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Çıkış yapılamadı:", error.message);
      return;
    }
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <Link href="/">
        <h1 className="text-xl font-bold text-black">Logo</h1>
      </Link>
      <nav className="flex items-center gap-4">
        {isSeller && (
          <>
            <Link
              href="/my-products"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 rounded-full"
            >
              Ürünlerim
            </Link>
            <Link
              href="/orders"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 rounded-full"
            >
              Sipariş Yönetimi
            </Link>
          </>
        )}
        {!user ? (
          <>
            <Link
              href="/login"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-medium px-4 py-1.5 rounded-full rounded transition"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 font-medium px-4 py-1.5 rounded-full rounded text-white transition"
            >
              Kayıt Ol
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/cart"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 rounded-full"
            >
              Sepet
            </Link>
            <Link
              href="/my-orders"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 rounded-full"
            >
              Siparişlerim
            </Link>

            <h3 className="text-sm text-gray-700">{user.email}</h3>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-sm font-medium px-4 py-1.5 rounded-full text-white transition"
            >
              Çıkış Yap
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
