@echo off
setlocal ENABLEDELAYEDEXPANSION

rem ====== KONFIG REPO (SESUAIKAN JIKA PERLU) ======
set GH_USER=dony102
set GH_REPO=veo3-react
set VITE_BASE=/veo3-react/

echo ============================
echo  AUTO FIX VITE + CLEAN + INSTALL + BUILD + DEPLOY (gh-pages)
echo ============================

rem 0) Cek root project
if not exist package.json (
  echo [ERROR] Jalankan skrip ini di folder project (ada package.json).
  pause & exit /b 1
)

rem 1) Pastikan vite.config.js ada dan base path benar
if not exist vite.config.js (
  echo [INFO] vite.config.js tidak ada - membuat baru...
  > vite.config.js echo import { defineConfig } from 'vite'
  >> vite.config.js echo import react from '@vitejs/plugin-react'
  >> vite.config.js echo.
  >> vite.config.js echo export default defineConfig({
  >> vite.config.js echo   base: '%VITE_BASE%',
  >> vite.config.js echo   plugins: [react()],
  >> vite.config.js echo })
) else (
  echo [INFO] Memeriksa base path di vite.config.js ...
  findstr /I /C:"base:" vite.config.js >NUL
  if %ERRORLEVEL% NEQ 0 (
    echo [FIX] Menambahkan base path ke vite.config.js
    > vite.config.js echo import { defineConfig } from 'vite'
    >> vite.config.js echo import react from '@vitejs/plugin-react'
    >> vite.config.js echo.
    >> vite.config.js echo export default defineConfig({
    >> vite.config.js echo   base: '%VITE_BASE%',
    >> vite.config.js echo   plugins: [react()],
    >> vite.config.js echo })
  ) else (
    findstr /I /C:"base: '%VITE_BASE%'" vite.config.js >NUL
    if %ERRORLEVEL% NEQ 0 (
      echo [FIX] Mengganti base path di vite.config.js menjadi '%VITE_BASE%'
      > vite.config.js echo import { defineConfig } from 'vite'
      >> vite.config.js echo import react from '@vitejs/plugin-react'
      >> vite.config.js echo.
      >> vite.config.js echo export default defineConfig({
      >> vite.config.js echo   base: '%VITE_BASE%',
      >> vite.config.js echo   plugins: [react()],
      >> vite.config.js echo })
    ) else (
      echo [OK] base path sudah benar: %VITE_BASE%
    )
  )
)

rem 2) Bersihkan node_modules (opsional aman)
echo.
echo [1/6] Removing node_modules (if exists) ...
if exist node_modules rmdir /s /q node_modules

rem Hapus lock lama jika ada mismatch
if exist package-lock.json (
  echo [INFO] Menghapus package-lock.json untuk install bersih...
  del /f /q package-lock.json
)

rem 3) Install deps
echo.
echo [2/6] Installing dependencies ...
npm install
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] npm install gagal.
  pause & exit /b %ERRORLEVEL%
)

rem Pastikan plugin react untuk Vite terpasang
call npm ls @vitejs/plugin-react >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [INFO] @vitejs/plugin-react belum ada. Menginstal...
  npm install @vitejs/plugin-react --save-dev
  IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal install @vitejs/plugin-react.
    pause & exit /b %ERRORLEVEL%
  )
)

rem 4) Build
echo.
echo [3/6] Building (vite build) ...
npm run build
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Build gagal.
  pause & exit /b %ERRORLEVEL%
)
if not exist dist (
  echo [ERROR] dist/ tidak ditemukan setelah build.
  pause & exit /b 1
)

rem 5) Deploy ke gh-pages
echo.
echo [4/6] Deploying dist/ to gh-pages (subtree) ...
git rev-parse --is-inside-work-tree >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Bukan repo git. Jalankan "git init" dan set remote origin dulu.
  pause & exit /b 1
)

git remote get-url origin >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Remote 'origin' belum diset. Contoh:
  echo   git remote add origin https://github.com/%GH_USER%/%GH_REPO%.git
  pause & exit /b 1
)

git subtree push --prefix dist origin gh-pages
IF %ERRORLEVEL% NEQ 0 (
  echo [WARN] Subtree push gagal. Mencoba metode fallback (worktree)...
  git fetch origin
  rmdir /s /q .gh-pages 2>NUL
  git worktree add .gh-pages gh-pages 2>NUL
  IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] Branch gh-pages belum ada. Membuat baru...
    git worktree add .gh-pages -b gh-pages
  )
  robocopy dist .gh-pages /E >NUL
  pushd .gh-pages
  git add .
  git commit -m "deploy: update gh-pages"
  git push -u origin gh-pages
  popd
  git worktree remove .gh-pages -f
)

rem 6) Info akhir
echo.
echo [5/6] Set GitHub Pages:
echo   Settings -> Pages -> Source = "Deploy from a branch"
echo   Branch  = "gh-pages" / (root)
echo.
echo [6/6] URL Situs:
echo   https://%GH_USER%.github.io/%GH_REPO%/
echo ============================
pause
