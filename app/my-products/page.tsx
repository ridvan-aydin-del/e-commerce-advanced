"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  photo_urls_array?: string[];
};

const MyProducts = () => {
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [updatedStatus, setUpdatedStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      if (currentUser) {
        const { data } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", currentUser.id);

        setSellerProducts(data || []);
      }
    };

    fetchSellerProducts();
  }, []);

  const handleChange = (
    index: number,
    field: keyof Product,
    value: string | number
  ) => {
    setSellerProducts((prev) =>
      prev.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      )
    );
  };

  const handleUpdate = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({
        title: product.title,
        price: product.price,
        stock: product.stock,
        category: product.category,
      })
      .eq("id", product.id);

    if (error) {
      alert("Güncelleme başarısız: " + error.message);
    } else {
      setUpdatedStatus(product.id);
      setTimeout(() => setUpdatedStatus(null), 2000);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ürünlerim</h1>

      {sellerProducts.length === 0 ? (
        <p>Henüz ürün eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sellerProducts.map((product, index) => {
            const rawUrl =
              Array.isArray(product.photo_urls_array) &&
              product.photo_urls_array[0]
                ? product.photo_urls_array[0]
                : null;

            const imageSrc =
              rawUrl && (rawUrl.startsWith("http") || rawUrl.startsWith("/"))
                ? rawUrl
                : "/placeholder.png";

            return (
              <div
                key={product.id}
                className="border p-4 rounded shadow bg-white space-y-2"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={imageSrc}
                    alt={product.title}
                    fill
                    className="object-cover rounded"
                    sizes="100%"
                  />
                </div>

                <input
                  value={product.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    handleChange(index, "price", +e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) =>
                    handleChange(index, "stock", +e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  value={product.category}
                  onChange={(e) =>
                    handleChange(index, "category", e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />

                <button
                  onClick={() => handleUpdate(product)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Güncelle
                </button>

                {updatedStatus === product.id && (
                  <p className="text-green-500 text-sm mt-1">✔️ Güncellendi</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
