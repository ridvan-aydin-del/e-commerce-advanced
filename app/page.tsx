import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0);

  if (error) {
    return <p>Hata oluştu: {error.message}</p>;
  }
  console.log(products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
