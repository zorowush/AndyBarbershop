<#
.SYNOPSIS
    Menghubungkan Master Unified Dev Guide & Skills ke proyek baru secara instan dan rapi.
.DESCRIPTION
    Skrip ini membuat symlink/junction atau menyalin aturan AGENTS.md, START_HERE.md,
    playbook, dan 67 skills ke dalam proyek target agar langsung dikenali oleh Antigravity.
.PARAMETER TargetDir
    Direktori proyek tujuan (misal: "D:\projects\my-saas-app").
.PARAMETER Standalone
    Jika diset, file akan disalin penuh (bukan junction/symlink). Cocok jika proyek ingin di-push ke tim repository.
.EXAMPLE
    .\setup-project.ps1 -TargetDir "D:\projects\my-saas-app"
    .\setup-project.ps1 -TargetDir "D:\projects\my-saas-app" -Standalone
#>

param (
    [Parameter(Mandatory=$true, Position=0)]
    [string]$TargetDir,

    [Parameter(Mandatory=$false)]
    [switch]$Standalone
)

$MasterDir = $PSScriptRoot

if (-not (Test-Path -Path $TargetDir)) {
    Write-Host "Target directory '$TargetDir' belum ada. Membuat direktori baru..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$ResolvedTarget = (Resolve-Path $TargetDir).Path
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Antigravity & Developer Unified Toolkit Initializer" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Master Guide : $MasterDir"
Write-Host "Target Proyek: $ResolvedTarget"
Write-Host "Mode         : $(if ($Standalone) {'Standalone Copy (Independent)'} else {'Junction / Symlink (Recommended - Auto-Update, 0 Disk Space)'})"
Write-Host "----------------------------------------------------------"

# 1. Pastikan folder .agents/ di target proyek
$AgentDir = Join-Path $ResolvedTarget ".agents"
if (-not (Test-Path $AgentDir)) {
    New-Item -ItemType Directory -Path $AgentDir -Force | Out-Null
}

# 2. Salin AGENTS.md dan START_HERE.md ke root proyek target
Copy-Item -Path (Join-Path $MasterDir "AGENTS.md") -Destination (Join-Path $ResolvedTarget "AGENTS.md") -Force
Copy-Item -Path (Join-Path $MasterDir "START_HERE.md") -Destination (Join-Path $ResolvedTarget "START_HERE.md") -Force

# Inisialisasi product-marketing.md di .agents jika belum ada
$TargetPM = Join-Path $AgentDir "product-marketing.md"
if (-not (Test-Path $TargetPM)) {
    Copy-Item -Path (Join-Path $MasterDir "playbook\16-product-marketing.md") -Destination $TargetPM -Force
    Write-Host "[OK] Template .agents/product-marketing.md berhasil disiapkan." -ForegroundColor Green
}
Write-Host "[OK] AGENTS.md & START_HERE.md berhasil disiapkan di root proyek." -ForegroundColor Green

# 3. Hubungkan playbook, skills, dan tools
$TargetSkills = Join-Path $AgentDir "skills"
$TargetPlaybook = Join-Path $AgentDir "playbook"
$TargetTools = Join-Path $AgentDir "tools"

if ($Standalone) {
    Write-Host "Menyalin playbook, 116 skills & tools secara lokal..." -ForegroundColor Yellow
    Copy-Item -Path (Join-Path $MasterDir "playbook") -Destination $AgentDir -Recurse -Force
    Copy-Item -Path (Join-Path $MasterDir "skills") -Destination $AgentDir -Recurse -Force
    Copy-Item -Path (Join-Path $MasterDir "tools") -Destination $AgentDir -Recurse -Force
    Write-Host "[OK] Seluruh playbook, 116 skills & tools berhasil disalin penuh ke .agents/" -ForegroundColor Green
} else {
    # Hapus target lama secara aman jika ada sebelum membuat junction
    if (Test-Path $TargetSkills) {
        $sk = Get-Item $TargetSkills
        if ($sk.Attributes -band [System.IO.FileAttributes]::ReparsePoint) { $sk.Delete() } else { Remove-Item -Path $TargetSkills -Recurse -Force }
    }
    if (Test-Path $TargetPlaybook) {
        $pb = Get-Item $TargetPlaybook
        if ($pb.Attributes -band [System.IO.FileAttributes]::ReparsePoint) { $pb.Delete() } else { Remove-Item -Path $TargetPlaybook -Recurse -Force }
    }
    if (Test-Path $TargetTools) {
        $tl = Get-Item $TargetTools
        if ($tl.Attributes -band [System.IO.FileAttributes]::ReparsePoint) { $tl.Delete() } else { Remove-Item -Path $TargetTools -Recurse -Force }
    }

    # Buat junction (NTFS junction tidak butuh hak akses Administrator)
    New-Item -ItemType Junction -Path $TargetSkills -Target (Join-Path $MasterDir "skills") | Out-Null
    New-Item -ItemType Junction -Path $TargetPlaybook -Target (Join-Path $MasterDir "playbook") | Out-Null
    New-Item -ItemType Junction -Path $TargetTools -Target (Join-Path $MasterDir "tools") | Out-Null
    Write-Host "[OK] Junction aktif: 116 skills, playbook & tools terhubung ke master." -ForegroundColor Green
}

# 4. Tambahkan ke .gitignore jika proyek adalah git repository (agar tidak membebani commit)
$GitDir = Join-Path $ResolvedTarget ".git"
$GitIgnore = Join-Path $ResolvedTarget ".gitignore"
if ((Test-Path $GitDir) -and (-not $Standalone)) {
    $IgnoreContent = ""
    if (Test-Path $GitIgnore) {
        $IgnoreContent = Get-Content $GitIgnore -Raw
    }
    if ($IgnoreContent -notmatch "\.agents/skills") {
        Add-Content -Path $GitIgnore -Value "`n# Antigravity Global Skills & Tools Junction`n.agents/skills`n.agents/playbook`n.agents/tools`n"
        Write-Host "[OK] Entry .agents/skills & tools telah ditambahkan ke .gitignore." -ForegroundColor Green
    }
}

Write-Host "----------------------------------------------------------"
Write-Host "SUKSES! Proyek Anda siap digunakan dengan Antigravity." -ForegroundColor Cyan
Write-Host "Buka $ResolvedTarget di Antigravity, lalu mulai dengan membaca START_HERE.md." -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
