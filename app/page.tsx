"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  photo_urls_array?: string[];
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceSort, setPriceSort] = useState("asc");

  const fetchProducts = useCallback(async () => {
    let query = supabase.from("products").select("*").gt("stock", 0);

    if (search) query = query.ilike("title", `%${search}%`);
    if (category) query = query.eq("category", category);
    if (priceSort)
      query = query.order("price", { ascending: priceSort === "asc" });

    const { data, error } = await query;
    if (!error) setProducts(data || []);
  }, [search, category, priceSort]); // ✅ Bağımlılıklar burada

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // ✅ Artık güvenli

  return (
    <div className="p-4 space-y-6">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap items-center gap-4 mb-4"
      >
        <input
          type="text"
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tüm Kategoriler</option>
          <option value="Ev">Ev</option>
          <option value="Kitap">Kitap</option>
          <option value="Moda">Moda</option>
        </select>
        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="asc">Fiyat (Artan)</option>
          <option value="desc">Fiyat (Azalan)</option>
        </select>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
