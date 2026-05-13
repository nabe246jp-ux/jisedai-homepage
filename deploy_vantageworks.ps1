# VantageWorks プレビューを Vercel にデプロイするスクリプト
# 実行: PowerShell から `.\deploy_vantageworks.ps1`

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== VantageWorks プレビュー公開 ===" -ForegroundColor Cyan
Write-Host ""

$base = "C:\Users\nabe2\Documents\Claude\Projects\次世代ホームページ"
$src  = Join-Path $base "VantageWorks_SmartSite_preview.html"
$repo = Join-Path $base "smart-site-mvp"
$pub  = Join-Path $repo "public"
$dst  = Join-Path $pub "vantageworks.html"

Write-Host "[1/4] public フォルダを準備..." -ForegroundColor Yellow
if (-not (Test-Path $pub)) {
    New-Item -ItemType Directory -Force -Path $pub | Out-Null
}

Write-Host "[2/4] プレビューHTMLをコピー..." -ForegroundColor Yellow
Copy-Item $src $dst -Force
$size = (Get-Item $dst).Length
Write-Host "      コピー完了 ($size bytes)" -ForegroundColor Green

Write-Host "[3/4] git に追加してコミット..." -ForegroundColor Yellow
Set-Location $repo
git add public/vantageworks.html
git commit -m "publish: vantageworks smart site preview" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "      (変更なし、またはコミット済み)" -ForegroundColor Gray
}

Write-Host "[4/4] GitHub に push..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "=== 完了 ===" -ForegroundColor Green
Write-Host ""
Write-Host "1〜2分後に下のURLで公開されます。" -ForegroundColor Cyan
Write-Host "  https://smart-site-mvp.vercel.app/vantageworks.html" -ForegroundColor White
Write-Host ""
Write-Host "Vercelのデプロイ状況は下のURLで確認できます。" -ForegroundColor Cyan
Write-Host "  https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Read-Host "Enterで閉じる"
