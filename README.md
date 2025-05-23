# 🛒 Next.js E-Ticaret Uygulaması

Bu proje, **Next.js** ve **Supabase** kullanılarak geliştirilmiş, kullanıcı ve satıcı rollerini destekleyen, tam işlevli bir e-ticaret platformudur. Kullanıcılar ürünleri görüntüleyebilir, sepete ekleyebilir, sahte bir ödeme adımından geçerek sipariş verebilir ve sipariş durumlarını takip edebilir.

---

## 🔧 Kullanılan Teknolojiler

- **Next.js 13+ (App Router)**
- **Supabase** (Auth, DB, RLS, Storage)
- **Tailwind CSS**
- **React Hooks** (Custom hooks dahil)

---

## 🚀 Özellikler

### 👤 Kullanıcı İşlevleri

- Kayıt ve giriş işlemleri (Supabase Auth)
- Ürünleri filtreleme, arama ve sıralama
- Sepete ürün ekleme ve çıkarma
- Sahte ödeme ekranı üzerinden sipariş oluşturma
- Sipariş geçmişi ve detay görüntüleme

### 🛍️ Satıcı Paneli

- Ürün ekleme, düzenleme, stok kontrolü
- Sipariş durumlarını güncelleme
- Satışa sunulan ürünlere gelen siparişlerin yönetimi
- Sipariş verildiğinde stok otomatik azalır

### 🔒 Güvenlik & Kısıtlamalar

- **RLS (Row Level Security)** ile kullanıcı yalnızca kendi verilerine erişebilir
- Ürün silme yerine **stok 0** yapılır (soft delete mantığı)
- Satıcı olmayan kullanıcılar yönetim sayfalarına erişemez

---

## 🖥️ Sayfa Listesi

| Sayfa             | Açıklama                               |
| ----------------- | -------------------------------------- |
| `/`               | Anasayfa (ürün listesi + filtreleme)   |
| `/cart`           | Kullanıcı sepeti                       |
| `/checkout`       | Sahte ödeme ekranı + sipariş oluşturma |
| `/my-orders`      | Kullanıcının tüm siparişleri           |
| `/my-orders/[id]` | Sipariş detay sayfası (gizlilik dahil) |
| `/my-products`    | Satıcının ürün yönetimi                |
| `/add-product`    | Yeni ürün ekleme                       |
| `/orders`         | Satıcının gelen siparişleri            |
| `/products/[id]`  | Ürün detay sayfası                     |

---

## 🔄 Geliştirme Aşamaları

- ✅ Auth yapısı kuruldu (giriş/çıkış)
- ✅ Ürün ekleme ve listeleme tamamlandı
- ✅ Sepet sistemi (Supabase destekli) kuruldu
- ✅ Checkout ve sipariş oluşturma tamamlandı
- ✅ Sipariş geçmişi ve detay sayfası eklendi
- ✅ Satıcı paneli geliştirildi
- ✅ Stok güncelleme otomasyonu eklendi
- ✅ Sipariş detayında kullanıcı doğrulama (sadece sahibi görebilir)
- ✅ Sayfa erişim güvenliği artırıldı

---

## 📸 Demo

https://e-commerce-advanced-mylu.vercel.app/

---

## 📁 Kurulum (Local)

```bash
git clone https://github.com/ridvan-aydin-del/e-commerce-advanced
cd e-commerce-advanced
npm install
npm run dev
```

.env.local dosyasına Supabase bağlantı bilgilerini (url + public anon key) girmeniz gerekmektedir.

---

## 📌 Notlar

Ödeme ekranı tamamen sahte olup sadece deneyim amaçlı tasarlanmıştır.

Supabase RLS politikaları manuel olarak tanımlanmıştır.

Bu proje kişisel portfolyo ve öğrenme süreci kapsamında geliştirilmiştir.

## ✍️ Geliştirici

Ad: Rıdvan Aydın
Github: github.com/ridvan-aydin-del
