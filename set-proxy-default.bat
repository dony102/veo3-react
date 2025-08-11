@echo off
REM === Suntik script default Proxy ke index.html ===
setlocal ENABLEDELAYEDEXPANSION
set "INDEX_FILE=.\index.html"

if not exist "%INDEX_FILE%" (
  echo [ERROR] index.html tidak ditemukan. Jalankan file ini dari folder proyek (yang ada index.html).
  pause
  exit /b 1
)

REM Backup
if exist "%INDEX_FILE%.bak" del /f /q "%INDEX_FILE%.bak"
copy /y "%INDEX_FILE%" "%INDEX_FILE%.bak" >nul

REM Tulis file baru dengan sisipan sebelum script Vite
> "%INDEX_FILE%.new" (
  for /f "usebackq delims=" %%L in ("%INDEX_FILE%") do (
    if "%%L"=="<script type="module" src="/src/main.jsx"></script>" (
      echo ^<!-- Force default provider = Proxy + base URL --^>
      echo ^<script^>
      echo (function(){const url='https://veo3-combined-proxy.anggimh102.workers.dev/api';try{localStorage.setItem('veo3-settings',JSON.stringify({provider:'proxy',proxyBaseUrl:url,apiKey:''}));}catch(e){};window.__VEO3_DEFAULTS__={provider:'proxy',proxyBaseUrl:url};})();
      echo ^</script^>
    )
    echo %%L
  )
)

move /y "%INDEX_FILE%.new" "%INDEX_FILE%" >nul
echo [OK] Script Proxy disisipkan ke index.html

REM === Build & deploy ke gh-pages ===
echo [STEP] npm install
npm install
if errorlevel 1 goto :err

echo [STEP] npm run build
npm run build
if errorlevel 1 goto :err

echo [STEP] git commit & push subtree
git add -A
git commit -m "Set default Proxy in index.html"
git subtree push --prefix dist origin gh-pages
if errorlevel 1 goto :err

echo [SELESAI] Kunjungi: https://dony102.github.io/veo3-react/
pause
exit /b 0

:err
echo [ERROR] Terjadi kesalahan saat build/deploy. Cek pesan di atas.
pause
exit /b 1
