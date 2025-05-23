import React from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";

type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  photo_urls_array?: string | string[]; // hala string geliyor olabilir
};

export default function ProductCard({ product }: { product: Product }) {
  let photoArray: string[] = [];

  if (Array.isArray(product.photo_urls_array)) {
    photoArray = product.photo_urls_array;
  } else if (typeof product.photo_urls_array === "string") {
    try {
      photoArray = JSON.parse(product.photo_urls_array);
    } catch {
      photoArray = [];
    }
  }

  const firstPhoto = photoArray?.[0];
  const isValidPhoto =
    firstPhoto && (firstPhoto.startsWith("http") || firstPhoto.startsWith("/"));

  const imageSrc =
    product.image_url && product.image_url !== ""
      ? product.image_url
      : isValidPhoto
      ? firstPhoto
      : "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>

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
