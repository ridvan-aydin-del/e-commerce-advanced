"use client";
import React from "react";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useSellerStatus } from "@/hooks/useSellerStatus";

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};
type TextareaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
const AddProduct = () => {
  const [user, setUser] = useState<User | null>(null);

  const { isSeller, loading } = useSellerStatus();

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    photo_urls: "",
    stock: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");

    const photoArray = form.photo_urls.split("\n").filter(Boolean);

    const { error } = await supabase.from("products").insert({
      title: form.title,
      description: form.description,
      price: form.price,
      image_url: photoArray,
      stock: form.stock,
      category: form.category,
      user_id: user?.id,
    });

    if (error) {
      alert("Hata: " + error.message);
    } else {
      setSuccess(`✅ Başarıyla eklendi! Sayfa: /${form.title}`);
      setForm({
        title: "",
        description: "",
        price: "",
        photo_urls: "",
        stock: "",
        category: "",
      });
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  if (!isSeller) {
    return <p>Bu sayfaya erişim yetkiniz yok.</p>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-center text-rose-600">
        Ürün Ekleme Paneli – Yeni Ürün Ekle
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <Textarea
          label="Fotoğraf URL'leri (her satıra 1 adet)"
          name="photo_urls"
          value={form.photo_urls}
          onChange={handleChange}
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          label="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
        <Input
          label="Stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />
        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>

      {success && <p className="text-green-600 text-center">{success}</p>}
    </main>
  );
};
function Input({ label, name, value, onChange, type = "text" }: InputProps) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
    </div>
  );
}
function Textarea({ label, name, value, onChange }: TextareaProps) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={label}
        className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
    </div>
  );
}
export default AddProduct;
