"use client";

import { useAddToCart } from "@/hooks/useAddToCart";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useAddToCart();

  return (
    <button
      onClick={() => addToCart(productId)}
      className="bg-rose-500  text-white px-4 py-2  rounded hover:bg-rose-600 transition"
    >
      Sepete Ekle
    </button>
  );
}
