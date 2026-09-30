param([int]$Port = 8085)
$ErrorActionPreference = 'Stop'
$base = "http://localhost:$Port"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('alex:demo-password'))
$headers = @{ Authorization = "Basic $encoded" }
$csrf = Invoke-RestMethod "$base/api/demo/csrf" -Headers $headers -WebSession $session
$headers[$csrf.headerName] = $csrf.token
Write-Host 'Owner profile: 15 published contents, including one private entry'
Invoke-RestMethod "$base/api/profiles/alex/page" -Headers $headers -WebSession $session | ConvertTo-Json -Depth 8
try {
    Write-Host 'Follow Jordan'
    Invoke-RestMethod "$base/api/profiles/jordan/follow" -Method Post -Headers $headers -WebSession $session -ContentType 'application/json' -Body '{"following":true}' | ConvertTo-Json -Depth 8
} finally {
    Write-Host 'Restore the initial follow state'
    Invoke-RestMethod "$base/api/profiles/jordan/follow" -Method Post -Headers $headers -WebSession $session -ContentType 'application/json' -Body '{"following":false}' | Out-Null
}
