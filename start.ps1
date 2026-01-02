# PowerShell script to start Kazira with auto environment configuration

Write-Host "Starting Kazira Demo Environment..."

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host ".env file not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creating .env from .env.example..." -ForegroundColor Green

    # Copy .env.example to .env
    Copy-Item ".env.example" ".env"

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "IMPORTANT: Please add your GEMINI_API_KEY" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Get your API key from: https://aistudio.google.com/app/apikey" -ForegroundColor Yellow
    Write-Host "2. Edit .env file and add your key on line 2:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   GEMINI_API_KEY=your_actual_api_key_here" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Save the file and run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Enter to open .env for editing..." -ForegroundColor Green
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

    # Open .env in default editor
    Start-Process "notepad.exe" ".env"

    Write-Host ""
    Write-Host "After adding your API key, run this script again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host ".env file found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Docker containers..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Docker Compose
docker-compose up --build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Services started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access at:" -ForegroundColor Yellow
Write-Host "  Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "  Health Check:  http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Keep script running to handle Ctrl+C gracefully
try {
    $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
} catch [System.Management.Automation.HostControlBreakException] {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    docker-compose down
}
