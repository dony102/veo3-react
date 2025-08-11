# Veo3 Web UI — React + Tailwind (Vite)

UI modern untuk generate video via **Veo 3** & **Veo 3 Fast**. Mendukung mode **KIE.ai langsung** atau **Proxy** (Cloudflare Worker contoh disertakan).

## Fitur
- React + Tailwind, komponen modular
- Prompt + upload gambar opsional
- Pilih model, aspect ratio, watermark, enableFallback
- Polling status hingga selesai, tampil video, download, Get 1080p

## Jalankan lokal
```bash
npm install
npm run dev
# buka http://localhost:5173
```

## Build & Deploy (GitHub Pages)
1. Edit `vite.config.js` → set `base: '/NAMA_REPO/'` jika deploy ke **project pages**.
2. Push ke branch `main`. Workflow akan build dan publish ke Pages.

## Keamanan
- Mode KIE langsung mengirim token dari browser. Untuk produksi, gunakan mode Proxy.
