param(
  [string]$ComposeFile = "infra/compose.yaml",
  [string]$ServiceName = "db",
  [string[]]$SqlFiles = @(
    "backend/db/migrations/001_create_tables.sql",
    "backend/db/migrations/002_insert_data_if_not_exists.sql"
  )
)

$ErrorActionPreference = 'Stop'

function Invoke-Checked {
  param(
    [string]$Description,
    [scriptblock]$Action
  )

  Write-Host $Description
  & $Action
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed (exit code $LASTEXITCODE): $Description"
  }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot

try {
  Invoke-Checked -Description "Starting container '$ServiceName' from $ComposeFile..." -Action {
    docker compose -f $ComposeFile up -d $ServiceName
  }

  $dbUser = (docker compose -f $ComposeFile exec -T $ServiceName sh -lc 'printf "%s" "$POSTGRES_USER"').Trim()
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($dbUser)) {
    throw "Could not resolve POSTGRES_USER from container environment."
  }

  $dbName = (docker compose -f $ComposeFile exec -T $ServiceName sh -lc 'printf "%s" "$POSTGRES_DB"').Trim()
  if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($dbName)) {
    throw "Could not resolve POSTGRES_DB from container environment."
  }

  Invoke-Checked -Description "Waiting for PostgreSQL readiness..." -Action {
    docker compose -f $ComposeFile exec -T $ServiceName sh -lc "until pg_isready -U '$dbUser' -d '$dbName' >/dev/null 2>&1; do sleep 1; done; echo PostgreSQL is ready."
  }

  foreach ($relativePath in $SqlFiles) {
    $hostPath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path $hostPath)) {
      throw "SQL file not found: $relativePath"
    }

    $fileName = Split-Path $hostPath -Leaf
    $sqlContent = Get-Content $hostPath -Raw

    Write-Host "Executing $relativePath..."
    $sqlContent | docker compose -f $ComposeFile exec -T $ServiceName psql -U $dbUser -d $dbName -v ON_ERROR_STOP=1 -f -
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to execute SQL file: $relativePath"
    }

    Write-Host "Applied: $fileName"
  }

  Write-Host "Database initialization finished successfully."
}
finally {
  Pop-Location
}
