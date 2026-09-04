<#
Interactive deployment helper for Cinehub

What this script does (interactive):
 - Checks current directory is a git repo with at least one commit
 - Optionally creates a GitHub repo via `gh repo create` (or skips if origin already set)
 - Pushes current branch to origin (main)
 - Generates a strong VOTER_TOKEN_SECRET and shows it (you copy it)
 - Runs `vercel --prod` to create/link the Vercel project and deploy
 - Helps add Vercel environment variables via `vercel env add` (interactive prompts will ask you to paste the secret)

Prereqs (you confirmed you installed these):
 - gh (GitHub CLI) logged in
 - vercel CLI logged in
 - git available
 - Node/npm (for project builds)

Run this from the project root in PowerShell:
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\deploy_to_vercel.ps1

This script does NOT accept or transmit secrets to any external service automatically. You will paste secrets when prompted by the CLIs.
#>

function Abort($msg) {
  Write-Host "ERROR: $msg" -ForegroundColor Red
  exit 1
}

Write-Host "Cinehub deploy helper" -ForegroundColor Cyan

# Ensure git repo
if (-not (Test-Path .git)) {
  Abort "No git repository found in the current folder. Initialize git and commit first."
}

# Ensure we have at least one commit
$hasCommits = git rev-parse --verify HEAD 2>$null
if ($LASTEXITCODE -ne 0) {
  Abort "No commits found. Make at least one commit before running this script."
}

# Ask for repo name and visibility
$defaultRepo = "cinehub"
$repoName = Read-Host "Enter GitHub repo name (default: $defaultRepo)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = $defaultRepo }
$visibility = Read-Host "Repo visibility (public/private) (default: public)"
if ([string]::IsNullOrWhiteSpace($visibility)) { $visibility = 'public' }
$visibility = $visibility.ToLower()
if ($visibility -ne 'public' -and $visibility -ne 'private') { $visibility = 'public' }

# Check if origin remote exists
$originUrl = $null
try { $originUrl = git remote get-url origin 2>$null } catch { $originUrl = $null }
if ($originUrl) {
  Write-Host "Existing 'origin' remote detected: $originUrl" -ForegroundColor Yellow
  $useExisting = Read-Host "Use existing origin and push to it? (y/N)"
  if ($useExisting -match '^(y|Y)') {
    Write-Host "Will push to existing origin: $originUrl" -ForegroundColor Green
  } else {
    Write-Host "Removing existing origin and creating a new one named 'origin' pointing to GitHub." -ForegroundColor Yellow
    git remote remove origin
    $originUrl = $null
  }
}

if (-not $originUrl) {
  # Build visibility flag
  $visFlag = if ($visibility -eq 'private') { '--private' } else { '--public' }

  Write-Host "Creating GitHub repo '$repoName' (visibility: $visibility) via gh..." -ForegroundColor Cyan
  $createCmd = "gh repo create $repoName $visFlag --source=. --remote=origin --push --confirm"
  Write-Host "Running: $createCmd"
  $createResult = & gh repo create $repoName $visFlag --source=. --remote=origin --push --confirm
  if ($LASTEXITCODE -ne 0) {
    Abort "gh repo create failed. Please ensure gh is authenticated (run 'gh auth login') and try again.\ngh output:\n$createResult"
  }
} else {
  Write-Host "Pushing current branch to origin/main..." -ForegroundColor Cyan
  git branch -M main 2>$null
  git push -u origin main
  if ($LASTEXITCODE -ne 0) { Abort "git push failed. Inspect output and ensure you have permission to push to the remote." }
}

# Generate a strong secret
Write-Host "Generating a strong VOTER_TOKEN_SECRET for you..." -ForegroundColor Cyan
$bytes = New-Object 'System.Byte[]' 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = ([System.BitConverter]::ToString($bytes)).Replace('-','').ToLower()
Write-Host "\n----- COPY THIS SECRET (keep it private) -----" -ForegroundColor Yellow
Write-Host $secret
Write-Host "---------------------------------------------\n" -ForegroundColor Yellow

Write-Host "Now the script will run 'vercel --prod' to create/link the project and deploy. Follow the interactive prompts from Vercel CLI." -ForegroundColor Cyan
$proceed = Read-Host "Run 'vercel --prod' now? (Y/n)"
if ($proceed -match '^(n|N)') { Write-Host 'Skipping vercel deploy step. You can run "vercel --prod" manually later.'; exit 0 }

# Run vercel --prod
Write-Host "Running: vercel --prod" -ForegroundColor Cyan
& vercel --prod
if ($LASTEXITCODE -ne 0) {
  Abort "vercel --prod failed. Resolve any vercel CLI errors and run the script again or run 'vercel --prod' manually."
}

# Ask user to add environment variables
Write-Host "Now the script will help you add environment variables to Vercel for the production environment." -ForegroundColor Cyan
Write-Host "When prompted, paste the secret displayed earlier for VOTER_TOKEN_SECRET." -ForegroundColor Yellow

$addSecret = Read-Host "Add VOTER_TOKEN_SECRET to Vercel now? (Y/n)"
if ($addSecret -notmatch '^(n|N)') {
  & vercel env add VOTER_TOKEN_SECRET production
  if ($LASTEXITCODE -ne 0) { Write-Host "Warning: adding VOTER_TOKEN_SECRET may have failed or been cancelled." -ForegroundColor Yellow }
}

$ttl = Read-Host "Enter VOTER_TOKEN_TTL_SECONDS (default 900)"
if ([string]::IsNullOrWhiteSpace($ttl)) { $ttl = '900' }
$addTtl = Read-Host "Add VOTER_TOKEN_TTL_SECONDS ($ttl) to Vercel now? (Y/n)"
if ($addTtl -notmatch '^(n|N)') {
  # Use vercel env add but we can also set value non-interactively by piping
  & vercel env add VOTER_TOKEN_TTL_SECONDS production
  if ($LASTEXITCODE -ne 0) { Write-Host "Warning: adding VOTER_TOKEN_TTL_SECONDS may have failed or been cancelled." -ForegroundColor Yellow }
}

$baseUrl = Read-Host "Enter NEXT_PUBLIC_BASE_URL (e.g. https://your-project.vercel.app) or leave blank to set later"
if (-not [string]::IsNullOrWhiteSpace($baseUrl)) {
  $addBase = Read-Host "Add NEXT_PUBLIC_BASE_URL to Vercel now? (Y/n)"
  if ($addBase -notmatch '^(n|N)') {
    & vercel env add NEXT_PUBLIC_BASE_URL production
    if ($LASTEXITCODE -ne 0) { Write-Host "Warning: adding NEXT_PUBLIC_BASE_URL may have failed or been cancelled." -ForegroundColor Yellow }
  }
} else {
  Write-Host "You can add NEXT_PUBLIC_BASE_URL later in the Vercel dashboard or with 'vercel env add'" -ForegroundColor Yellow
}

Write-Host "Environment variables added (or skipped). Triggering a final production deploy to pick them up..." -ForegroundColor Cyan
& vercel --prod
if ($LASTEXITCODE -ne 0) { Write-Host "Final deploy may have failed; check vercel dashboard logs." -ForegroundColor Red } else { Write-Host "Deployed successfully (check your Vercel dashboard for the URL)." -ForegroundColor Green }

Write-Host "Done. Remember to revoke any temporary tokens you created for sharing, and set NEXT_PUBLIC_BASE_URL in Vercel if you skipped it." -ForegroundColor Cyan
