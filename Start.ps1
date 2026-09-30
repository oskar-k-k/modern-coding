param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
function Test-DockerReady {
    # Windows PowerShell 5.1 can turn native stderr into terminating errors.
    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        & docker info *> $null
        return $LASTEXITCODE -eq 0
    } finally { $ErrorActionPreference = $previousPreference }
}
try {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw 'Docker Desktop installieren (Linux-Container), danach Start.cmd erneut starten.'
    }
    Write-Host 'Modern Coding - Docker pruefen ...' -ForegroundColor Green
    if (-not (Test-DockerReady)) {
        $desktop = Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe'
        if (-not (Test-Path -LiteralPath $desktop)) { throw 'Docker starten und Start.cmd erneut ausfuehren.' }
        Start-Process -FilePath $desktop -WindowStyle Hidden
        Write-Host 'Warte auf Docker Desktop ...'
        $ready = $false
        for ($attempt = 0; $attempt -lt 60; $attempt++) {
            Start-Sleep -Seconds 3
            if (Test-DockerReady) { $ready = $true; break }
        }
        if (-not $ready) { throw 'Docker ist noch nicht bereit. Docker Desktop pruefen und erneut starten.' }
    }
    & docker compose version
    if ($LASTEXITCODE -ne 0) { throw 'Docker Compose v2 fehlt. Bitte Docker Desktop aktualisieren.' }
    Write-Host 'Frontend und Backend bauen und starten. Der erste Start benoetigt Internet und einige Minuten.'
    & docker compose up --build --detach --wait --wait-timeout 180
    if ($LASTEXITCODE -ne 0) { throw 'Start fehlgeschlagen. Details: docker compose logs --tail 100' }
    $published = & docker compose port frontend 3000
    if ($LASTEXITCODE -ne 0 -or -not $published) { throw 'Der veroeffentlichte Frontend-Port konnte nicht ermittelt werden.' }
    $url = 'http://' + $published.Trim()
    Write-Host "Praesentation bereit: $url" -ForegroundColor Green
    if (-not $NoBrowser) { Start-Process $url }
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
