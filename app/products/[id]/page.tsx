"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  photo_urls_array?: string[];
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (!error && data) {
        setProduct(data as Product);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <p className="p-6">Yükleniyor...</p>;
  if (!product) return <p className="p-6 text-red-500">Ürün bulunamadı.</p>;

  const firstPhoto = Array.isArray(product.photo_urls_array)
    ? product.photo_urls_array[0]
    : null;

  const imageSrc =
    firstPhoto && (firstPhoto.startsWith("http") || firstPhoto.startsWith("/"))
      ? firstPhoto
      : "/placeholder.png";

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="relative w-full h-[500px]">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover rounded-xl shadow"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 text-base">{product.description}</p>
          <p className="text-rose-600 font-bold text-2xl">{product.price} ₺</p>
          <p className="text-sm text-gray-500">Stok: {product.stock}</p>
          <p className="text-sm text-gray-500">Kategori: {product.category}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </main>
  );
}
