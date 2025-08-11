# === Force default Provider=Proxy + Proxy Base URL di index.html, lalu build & deploy gh-pages ===
$Project = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Project

$index = Join-Path $Project "index.html"
if (!(Test-Path $index)) { Write-Host "[ERROR] index.html tidak ditemukan." -ForegroundColor Red; exit 1 }

# Backup
Copy-Item $index "$index.bak" -Force

# Snippet yang disisipkan (jalan sebelum script Vite)
$snippet = @"
<!-- Force default provider = Proxy + base URL -->
<script>
(function () {
  const url = 'https://veo3-combined-proxy.anggimh102.workers.dev/api';
  try {
    localStorage.setItem('veo3-settings', JSON.stringify({
      provider: 'proxy',
      proxyBaseUrl: url,
      apiKey: ''
    }));
  } catch (e) {}
  window.__VEO3_DEFAULTS__ = { provider: 'proxy', proxyBaseUrl: url };
})();
</script>
"@

# Sisipkan sebelum <script type="module" src="/src/main.jsx">, kalau tidak ada -> sebelum </head>
$html = Get-Content -Raw -Path $index
$marker = '<script type="module" src="/src/main.jsx"></script>'
if ($html -like "*$marker*") {
  $html = $html -replace [regex]::Escape($marker), ($snippet + "`r`n" + $marker)
} elseif ($html -like "*</head>*") {
  $html = $html -replace '</head>', ($snippet + "`r`n</head>")
} else {
  $html = $snippet + "`r`n" + $html
}
Set-Content -Path $index -Value $html -Encoding UTF8
Write-Host "[OK] Snippet disisipkan ke index.html" -ForegroundColor Green

# Build & deploy
Write-Host "[STEP] npm install" -ForegroundColor Yellow
npm install; if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] npm install gagal" -ForegroundColor Red; exit 1 }

Write-Host "[STEP] npm run build" -ForegroundColor Yellow
npm run build; if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] Build gagal" -ForegroundColor Red; exit 1 }

# Pastikan git repo
git rev-parse --is-inside-work-tree *> $null; if ($LASTEXITCODE -ne 0) { Write-Host "[ERROR] Bukan repo git." -ForegroundColor Red; exit 1 }

Write-Host "[STEP] Commit & push subtree -> gh-pages" -ForegroundColor Yellow
git add -A
git commit -m "Set default Proxy in index.html" 2>$null

# coba subtree, kalau gagal -> fallback worktree
git subtree push --prefix dist origin gh-pages
if ($LASTEXITCODE -ne 0) {
  Write-Host "[WARN] subtree gagal, mencoba fallback worktree..." -ForegroundColor DarkYellow
  git fetch origin
  if (Test-Path ".gh-pages") { Remove-Item -Recurse -Force ".gh-pages" }
  git worktree add ".gh-pages" gh-pages 2>$null
  if ($LASTEXITCODE -ne 0) { git worktree add ".gh-pages" -b gh-pages }
  robocopy "dist" ".gh-pages" /E | Out-Null
  Push-Location ".gh-pages"
  git add .
  git commit -m "deploy: gh-pages"
  git push -u origin gh-pages
  Pop-Location
  git worktree remove ".gh-pages" -f
}

Write-Host "`n[SELESAI] Buka: https://dony102.github.io/veo3-react/" -ForegroundColor Cyan
