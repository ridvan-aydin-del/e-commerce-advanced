🛒 Next.js E-Ticaret Uygulaması

Bu proje, Next.js ve Supabase kullanılarak geliştirilmiş tam işlevli bir e-ticaret uygulamasıdır. Kullanıcılar ürünleri görüntüleyebilir, sepete ekleyebilir, sahte bir ödeme adımından geçerek sipariş oluşturabilir ve sipariş durumlarını takip edebilir.

🔧 Kullanılan Teknolojiler

Next.js 13+ (App Router)

Supabase (Auth, DB, Storage)

Tailwind CSS

React Hooks (Custom Hooks dahil)

🚀 Özellikler

👤 Kullanıcı İşlevleri

Kayıt ve giriş (Supabase Auth)

Ürünleri görüntüleme

Sepete ürün ekleme

Sipariş oluşturma (sahte ödeme sayfası dahil)

🛍️ Satıcı Paneli

Kendi ürünlerini ekleme, düzenleme ve stok yönetimi

Siparişlere durum güncelleme (hazırlanıyor / kargoya verildi / teslim edildi)

Stok otomatik olarak siparişle birlikte azalır

🔒 Güvenlik & Kısıtlamalar

RLS (Row Level Security) ile sadece kullanıcıya ait verilere erişim

Ürün silme yerine stok 0 yapılır (soft delete mantığı)

Satıcı olmayan kullanıcılar satıcı paneline erişemez

🖥️ Sayfa Listesi

Sayfa

Açıklama

/

Anasayfa (ürün listesi)

/cart

Sepetim

/checkout

Ödeme ekranı

/my-orders

Kullanıcı sipariş geçmişi

/seller-orders

Satıcının ürünlerine gelen siparişler

/my-products

Satıcının ürün yönetimi paneli

🔄 Geliştirme Aşamaları

✅ Auth yapısı kuruldu (giriş/çıkış)

✅ Ürün ekleme ve listeleme tamamlandı

✅ Sepet sistemi oluşturuldu (Supabase tabanlı)

✅ Checkout ekranı ve sipariş oluşturma tamamlandı

✅ Satıcı paneli geliştirildi

✅ Stok güncelleme mantığı eklendi

📸 Demo

Henüz deploy edilmedi.

📁 Kurulum (local)

git clone (https://github.com/ridvan-aydin-del/e-commerce-advanced)
cd proje-adi
npm install
npm run dev

.env.local içerisine Supabase url ve public anon key girilmelidir.

📌 Notlar

Ödeme ekranı sahte olup sadece deneyim amaçlıdır.

Supabase RLS politikaları manuel olarak tanımlanmıştır.

Proje kişisel portfolyo amacıyla geliştirilmiştir.

✍️ Geliştirici

Ad: Rıdvan Aydın
Github: github.com/ridvan-aydin-del
