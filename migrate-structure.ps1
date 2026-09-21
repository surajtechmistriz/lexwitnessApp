# =========================================================
# lexwitnessApp restructure script
# Run from: D:\Projects\lexwitnessApp  (repo root)
# Usage:    powershell -ExecutionPolicy Bypass -File .\migrate-structure.ps1
# =========================================================
# IMPORTANT:
#   1. Commit or stash all current changes first.
#   2. This script uses `git mv`, so it must be run inside a git repo
#      with a clean working tree (or at least these files not staged
#      with conflicting changes).
#   3. After running, fix import paths (see note at the bottom).
# =========================================================

$ErrorActionPreference = "Stop"
Set-Location "src"

function New-Dir($path) {
    if ([string]::IsNullOrWhiteSpace($path)) {
        return
    }
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created dir: $path"
    }
}

function Move-File($src, $dst) {
    if (Test-Path $src) {
        $dstDir = Split-Path $dst -Parent
        if (-not [string]::IsNullOrWhiteSpace($dstDir)) {
            New-Dir $dstDir
        }
        git mv $src $dst
        Write-Host "Moved: $src -> $dst"
    } else {
        Write-Host "SKIP (not found): $src" -ForegroundColor Yellow
    }
}

# ---------------------------------------------------------
# 1. Root files
# ---------------------------------------------------------
Move-File "AppRoot.tsx" "App.tsx"

# ---------------------------------------------------------
# 2. assets/ reorganization
# ---------------------------------------------------------
New-Dir "assets\images"
New-Dir "assets\icons"
New-Dir "assets\fonts"

Move-File "assets\banner.jpg"        "assets\images\banner.jpg"
Move-File "assets\editorial.avif"    "assets\images\editorial.avif"
Move-File "assets\image.png"         "assets\images\image.png"
Move-File "assets\fallback.png"      "assets\images\fallback.png"
Move-File "assets\avatar.jpg"        "assets\images\avatar.jpg"
Move-File "assets\quote-left.png"    "assets\icons\quote-left.png"
Move-File "assets\quote-right.png"   "assets\icons\quote-right.png"
Move-File "assets\drawer.png"        "assets\icons\drawer.png"
Move-File "assets\logo-dark.png"     "assets\icons\logo-dark.png"
Move-File "assets\main-logo.png"     "assets\icons\main-logo.png"
# NOTE: review + delete duplicates manually, git mv can't dedupe:
#   assets\main-logo (2).png
#   assets\main-logo-removebg-preview.png

# ---------------------------------------------------------
# 3. components/ reorganization
# ---------------------------------------------------------
New-Dir "components\layout"

Move-File "components\common\Header.tsx"        "components\layout\Header.tsx"
Move-File "components\common\Footer.tsx"         "components\layout\Footer.tsx"
Move-File "components\common\Menubar.tsx"        "components\layout\Menubar.tsx"
Move-File "components\common\CustomDrawer.tsx"   "components\layout\CustomDrawer.tsx"
Move-File "components\common\SplashScreen.tsx"   "components\layout\SplashScreen.tsx"

# fold modal/ into components/common/
Move-File "modal\GlobalPopup.tsx"      "components\common\GlobalPopup.tsx"
Move-File "modal\NoInternetPopup.tsx"  "components\common\NoInternetPopup.tsx"
Move-File "modal\Popup.tsx"            "components\common\Popup.tsx"

# ---------------------------------------------------------
# 4. screens/ -> features/
# ---------------------------------------------------------
New-Dir "features"

# home
New-Dir "features\home\api"
New-Dir "features\home\components"
New-Dir "features\home\sections"
Move-File "screens\home\HomeScreen.tsx"                 "features\home\HomeScreen.tsx"
Move-File "screens\home\api\home.api.ts"                "features\home\api\home.api.ts"
Move-File "screens\home\api\service.ts"                 "features\home\api\service.ts"
Get-ChildItem "screens\home\components" -File -ErrorAction SilentlyContinue | ForEach-Object {
    Move-File $_.FullName "features\home\components\$($_.Name)"
}
Get-ChildItem "screens\home\sections" -File -ErrorAction SilentlyContinue | ForEach-Object {
    Move-File $_.FullName "features\home\sections\$($_.Name)"
}
Move-File "screens\home\types\types.ts"                 "features\home\types.ts"

# auth
New-Dir "features\auth\api"
New-Dir "features\auth\hooks"
New-Dir "features\auth\schemas"
Move-File "screens\auth\api\auth.ts"       "features\auth\api\auth.ts"
Move-File "screens\auth\api\profile.ts"    "features\auth\api\profile.ts"
Move-File "screens\auth\api\razorpay.ts"   "features\auth\api\razorpay.ts"
Move-File "screens\auth\api\services.ts"   "features\auth\api\services.ts"
Move-File "screens\auth\screens\EditProfile.tsx"    "features\auth\EditProfile.tsx"
Move-File "screens\auth\screens\ForgetPassword.tsx" "features\auth\ForgetPassword.tsx"
Move-File "screens\auth\screens\Register.tsx"       "features\auth\Register.tsx"
Move-File "screens\auth\screens\ResetPassword.tsx"  "features\auth\ResetPassword.tsx"
Move-File "screens\auth\screens\SignIn.tsx"         "features\auth\SignIn.tsx"
Move-File "screens\auth\screens\Subscription.tsx"   "features\auth\Subscription.tsx"

# article
New-Dir "features\article\components"
Move-File "screens\article\ArticleScreen.tsx"            "features\article\ArticleScreen.tsx"
Move-File "screens\article\components\shareArticle.tsx"  "features\article\components\shareArticle.tsx"
Move-File "screens\article\components\SocialShare.tsx"   "features\article\components\SocialShare.tsx"
Move-File "screens\article\components\Testimonial.tsx"   "features\article\components\Testimonial.tsx"

# author
New-Dir "features\author\api"
Move-File "screens\author\AuthorScreen.tsx"          "features\author\AuthorScreen.tsx"
Move-File "screens\author\api\authorarticle.ts"      "features\author\api\authorarticle.ts"

# category
Move-File "screens\category\CategoryScreen.tsx" "features\category\CategoryScreen.tsx"

# dashboard
Move-File "screens\dashboard\DashboardScreen.tsx" "features\dashboard\DashboardScreen.tsx"
Move-File "screens\dashboard\api.ts"              "features\dashboard\api\dashboard.api.ts"

# editorial
New-Dir "features\editorial\api"
Move-File "screens\editorial\EditorialDetail.tsx" "features\editorial\EditorialDetail.tsx"
Move-File "screens\editorial\api\service.ts"      "features\editorial\api\service.ts"

# invoice
New-Dir "features\invoice"
Move-File "screens\Invoice\invoice.ts"          "features\invoice\invoice.ts"
Move-File "screens\Invoice\invoiceDownload.ts"  "features\invoice\invoiceDownload.ts"
Move-File "screens\Invoice\InvoiceScreen.tsx"   "features\invoice\InvoiceScreen.tsx"

# magazines
New-Dir "features\magazines\api"
New-Dir "features\magazines\components"
Move-File "screens\magazines\MagazineDetailScreen.tsx" "features\magazines\MagazineDetailScreen.tsx"
Move-File "screens\magazines\MagazinesScreen.tsx"      "features\magazines\MagazinesScreen.tsx"
Move-File "screens\magazines\api\magazine.ts"          "features\magazines\api\magazine.ts"
Move-File "screens\magazines\components\MagazineList.tsx" "features\magazines\components\MagazineList.tsx"

# archive
Move-File "screens\archive\ArchiveScreen.tsx" "features\archive\ArchiveScreen.tsx"

# tag
Move-File "screens\tag\TagScreen.tsx" "features\tag\TagScreen.tsx"

# static pages
New-Dir "features\static"
Move-File "screens\AboutUs.tsx"             "features\static\AboutUs.tsx"
Move-File "screens\ContactUs.tsx"           "features\static\ContactUs.tsx"
Move-File "screens\PrivacyPolicy.tsx"       "features\static\PrivacyPolicy.tsx"
Move-File "screens\TermsAndConditions.tsx"  "features\static\TermsAndConditions.tsx"

# ---------------------------------------------------------
# 5. network/ layer (new, mirrors Next.js network/)
# ---------------------------------------------------------
New-Dir "network"
Move-File "services\axios.ts" "network\axios.ts"

# ---------------------------------------------------------
# 6. services/ -> keep only cross-cutting logic
# ---------------------------------------------------------
Move-File "services\api\author.ts"         "features\author\api\author.ts"
Move-File "services\api\category.ts"       "features\category\api\category.ts"
Move-File "services\api\editorpicks.ts"    "features\home\api\editorpicks.ts"
Move-File "services\api\heroCard.ts"       "features\home\api\heroCard.ts"
Move-File "services\api\latestedition.ts"  "features\home\api\latestedition.ts"
Move-File "services\api\plans.ts"          "features\auth\api\plans.ts"
Move-File "services\api\posts.ts"          "features\article\api\posts.ts"
Move-File "services\api\subscription.ts"   "features\auth\api\subscription.ts"
Move-File "services\api\years.ts"          "features\magazines\api\years.ts"

# ---------------------------------------------------------
# 7. skeleton/ -> distribute into features (or keep central)
#    (kept central here since they're generic loading states)
# ---------------------------------------------------------
# no move needed if you keep skeleton/ as-is; otherwise:
# Move-File "skeleton\HeroSkeleton.tsx" "features\home\components\HeroSkeleton.tsx"
# Move-File "skeleton\HomeSkeleton.tsx" "features\home\components\HomeSkeleton.tsx"

# ---------------------------------------------------------
# 8. utils/ cleanup
# ---------------------------------------------------------
New-Dir "utils\helpers"
Move-File "utils\helper\dateHelper.ts"        "utils\helpers\dateHelper.ts"
Move-File "utils\helper\navigationHelper.ts"  "utils\helpers\navigationHelper.ts"
Move-File "utils\helper\refreshProfile.ts"    "utils\helpers\refreshProfile.ts"

# ---------------------------------------------------------
# 9. redux/ split
# ---------------------------------------------------------
# rootReducer.ts should be manually extracted from store.ts
# (script can't safely split file contents automatically)

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "Structural move complete." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "MANUAL STEPS STILL REQUIRED:"
Write-Host "  1. Delete/consolidate duplicate logo assets in assets\icons\"
Write-Host "  2. Rename utils\authEvents.js -> utils\authEvents.ts and fix syntax"
Write-Host "  3. Manually split rootReducer.ts out of redux\store.ts"
Write-Host "  4. Merge theme\colors.ts and utils\constants\colors.ts into one source"
Write-Host "  5. Run a project-wide import path fix (see below)"
