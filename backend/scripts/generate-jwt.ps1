# Generates a strong random JWT secret and prints a ready-to-paste Render env block (ASCII-only output)
param(
  [int]$ByteCount = 64,
  [switch]$Base64Url
)

# Debug
Write-Host "Debug: ByteCount param = $ByteCount"
Write-Host "Type of ByteCount: $($ByteCount.GetType())"

# Generate cryptographically secure random bytes
# Create array using Array class for PS 5.1 compatibility
$byteArray = [Array]::CreateInstance([byte], $ByteCount)
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($byteArray)
$rng.Dispose()

# Debug
Write-Host "Array length after GetBytes: $($byteArray.Length)"
Write-Host "First 5 bytes: $($byteArray[0..4])"

# Standard Base64
$secretB64 = [Convert]::ToBase64String($byteArray)

# Base64URL variant (URL-safe, no padding)
# Trim all trailing '=' padding characters
$secretB64Url = $secretB64.TrimEnd('=')
$secretB64Url = $secretB64Url.Replace('+','-').Replace('/','_')

if ($Base64Url) {
  $secret = $secretB64Url
  $label = 'Base64URL'
} else {
  $secret = $secretB64
  $label = 'Base64'
}

$len = $secret.Length

# Informational output (ASCII only to avoid mojibake)
Write-Host ("Generated JWT secret ({0}, {1} bytes):" -f $label, $ByteCount) -ForegroundColor Cyan
Write-Host $secret

if ($len -lt 86) {
  Write-Host ("[WARN] Secret length appears short ({0} chars). Expected ~88 for Base64(64 bytes) or ~86 for Base64URL." -f $len) -ForegroundColor Yellow
}

Write-Host ""  # blank line
Write-Host "Copy-paste into Render -> Environment:" -ForegroundColor Green
Write-Host "JWT_SECRET=$secret"
