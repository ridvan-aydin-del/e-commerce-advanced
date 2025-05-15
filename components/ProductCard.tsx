import React from "react";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  photo_urls?: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4">
      <img
        src={product.image_url || product.photo_urls?.[0]}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
      <p className="text-rose-600 font-bold text-lg mb-2">{product.price} ₺</p>
      <Link
        href={`/products/${product.id}`}
        className="bg-green-500 text-white px-4 py-2 mr-1 rounded hover:bg-green-600 transition"
      >
        Detay
      </Link>

      <AddToCartButton productId={product.id} />
    </div>
  );
}
