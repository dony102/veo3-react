# ==== KONFIGURASI ====
$User = "dony102"
$Repo = "veo3-react"
$ViteBase = "/veo3-react/"

Write-Host "=== Vite + React: Build & Deploy ke gh-pages ===" -ForegroundColor Cyan

# 0) Cek root
if (!(Test-Path "package.json")) {
  Write-Host "[ERROR] Jalankan script di folder project (ada package.json)." -ForegroundColor Red
  exit 1
}

# 1) Pastikan vite.config.js benar
$viteConfig = @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '$ViteBase',
  plugins: [react()],
})
"@

Set-Content -Path "vite.config.js" -Value $viteConfig -Encoding UTF8
Write-Host "[OK] vite.config.js diset base: $ViteBase" -ForegroundColor Green

# 2) Install deps
Write-Host "[STEP] npm install ..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] npm install gagal." -ForegroundColor Red; exit 1 }

# Pastikan plugin react untuk Vite
try {
  npm ls @vitejs/plugin-react | Out-Null
} catch {
  Write-Host "[INFO] Menginstal @vitejs/plugin-react ..." -ForegroundColor Yellow
  npm install @vitejs/plugin-react --save-dev
  if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] Gagal install @vitejs/plugin-react." -ForegroundColor Red; exit 1 }
}

# 3) Build
Write-Host "[STEP] npm run build ..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0 -or !(Test-Path "dist")) {
  Write-Host "[ERROR] Build gagal atau dist/ tidak ditemukan." -ForegroundColor Red
  exit 1
}

# 4) Deploy ke gh-pages
Write-Host "[STEP] Deploy dist/ ke gh-pages (subtree) ..." -ForegroundColor Yellow
git rev-parse --is-inside-work-tree | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] Bukan repo git. Set remote origin dulu." -ForegroundColor Red; exit 1 }

# coba subtree
git subtree push --prefix dist origin gh-pages
if ($LASTEXITCODE -ne 0) {
  Write-Host "[WARN] Subtree gagal. Coba fallback worktree..." -ForegroundColor DarkYellow

  git fetch origin
  if (Test-Path ".gh-pages") { Remove-Item -Recurse -Force ".gh-pages" }
  git worktree add ".gh-pages" gh-pages 2>$null
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Branch gh-pages belum ada. Membuat baru..." -ForegroundColor Yellow
    git worktree add ".gh-pages" -b gh-pages
  }

  robocopy "dist" ".gh-pages" /E | Out-Null
  Push-Location ".gh-pages"
  git add .
  git commit -m "deploy: update gh-pages" 2>$null
  git push -u origin gh-pages
  Pop-Location
  git worktree remove ".gh-pages" -f
}

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "GitHub Pages:" -NoNewline; Write-Host " Settings → Pages → Source = Deploy from a branch, Branch = gh-pages / (root)" -ForegroundColor Yellow
Write-Host "URL: https://$User.github.io/$Repo/" -ForegroundColor Cyan
