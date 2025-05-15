import { supabase } from "@/lib/supabase";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return <p className="p-6 text-red-500">Ürün bulunamadı.</p>;
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Sol: Fotoğraf */}
        <div>
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow"
          />
        </div>

        {/* Sağ: Ürün Bilgileri */}
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
