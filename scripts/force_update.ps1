# Update all dependencies and dev dependencies to their latest
# in the current folder

# Set ErrorActionPreference to 'Stop' to terminate the script on error
$ErrorActionPreference = 'Stop'

if (-not (Test-Path ".\package.json")) {
    Write-Output "[ERROR] Must run from a directory with a 'package.json' file"
    exit 1
}

# Get dev dependencies
$allDependencies = npm ls --parseable | Select-Object -Skip 1 | ForEach-Object {
    $_ -replace ".*\\node_modules\\(.*)", '$1'
} | ForEach-Object {
    $_ -replace "\\", '/'
}

# Get prod dependencies
$prodDependencies = npm list --omit dev --parseable | Select-Object -Skip 1 | ForEach-Object {
    $_ -replace ".*\\node_modules\\(.*)", '$1'
} | ForEach-Object {
    $_ -replace "\\", '/'
}

# Check if $allDependencies is null, if so set it to an empty array
if (-not $allDependencies) {
    $allDependencies = @()
}

# Check if $prodDependencies is null, if so set it to an empty array
if (-not $prodDependencies) {
    $prodDependencies = @()
}

# Filter out common dependencies
$devDependencies = Compare-Object -ReferenceObject $prodDependencies -DifferenceObject $allDependencies -IncludeEqual | Where-Object {
    $_.SideIndicator -eq '=>'
} | ForEach-Object {
    $_.InputObject + '@latest'
}

# Append "@latest" to all elements in $prodDependencies
$prodDependencies = $prodDependencies | ForEach-Object {
    $_ + '@latest'
}

# Install dev dependencies
Write-Output "[INFO] Updating dev dependencies"
npm i -D $devDependencies

if ($LastExitCode -ne 0) {
    Write-Output "Error occurred while installing dev dependencies. Exit code: $LastExitCode"
    exit $LastExitCode
}

# Install prod dependencies
Write-Output "[INFO] Updating prod dependencies"
npm i -D $prodDependencies

if ($LastExitCode -ne 0) {
    Write-Output "Error occurred while installing prod dependencies. Exit code: $LastExitCode"
    exit $LastExitCode
}

# Remove unused
npm update
