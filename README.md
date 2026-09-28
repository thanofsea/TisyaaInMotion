# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Tisya / Movement Log

Blog dan portofolio dance satu halaman, dibangun dengan React, Vite, Tailwind CSS, dan Framer Motion.

### Menjalankan

```sh
npm install
npm run dev
```

Periksa build produksi dengan `npm run build` dan jalankan pemeriksaan kode dengan `npm run lint`.

### Memperbarui artikel

Edit array `articles` di `src/components/JournalSection.jsx`. Setiap artikel memiliki `title`, `category`, `excerpt`, `body`, `image`, serta teks alternatif gambar. Tambahkan entri baru untuk menerbitkan catatan berikutnya.

### Privasi

Tinjau data sekolah/kelas, tanggal lahir, dan tautan WhatsApp sebelum mengunggah situs ke internet. Data profil serta kontak tertanam pada kode frontend.
