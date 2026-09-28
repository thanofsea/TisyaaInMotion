# TisyaaInMotion

Blog dan portofolio dance satu halaman, dibangun dengan React, Vite, Tailwind CSS, dan Framer Motion.

## Menjalankan

```sh
npm install
npm run dev
```

Periksa build produksi dengan `npm run build` dan jalankan pemeriksaan kode dengan `npm run lint`.

## Deployment

Setiap push ke branch `main` otomatis membangun dan menerbitkan situs ke GitHub Pages melalui GitHub Actions.

## Memperbarui artikel

Edit array `articles` di `src/components/JournalSection.jsx`. Setiap artikel memiliki `title`, `category`, `excerpt`, `body`, `image`, serta teks alternatif gambar. Tambahkan entri baru untuk menerbitkan catatan berikutnya.

## Privasi

Tinjau data sekolah/kelas, tanggal lahir, dan tautan WhatsApp sebelum mengunggah situs ke internet. Data profil serta kontak tertanam pada kode frontend.
