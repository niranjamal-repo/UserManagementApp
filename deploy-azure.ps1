# Azure Deployment Script for User Management App
# PowerShell version for Windows

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "user-management-rg",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "Central US",
    
    [Parameter(Mandatory=$false)]
    [string]$SqlAdminPassword = "YourPassword123!"
)

# Generate unique names
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$SqlServerName = "user-management-sql-$timestamp"
$AppServiceName = "user-management-api-$timestamp"
$DatabaseName = "UserManagementDB"
$SqlAdminUser = "sqladmin"

Write-Host "Starting Azure deployment..." -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Cyan
Write-Host "SQL Server: $SqlServerName" -ForegroundColor Cyan
Write-Host "App Service: $AppServiceName" -ForegroundColor Cyan

# Login to Azure (run this first if not logged in)
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
try {
    $context = az account show --query "id" -o tsv 2>$null
    if (-not $context) {
        Write-Host "Please login to Azure first by running: az login" -ForegroundColor Red
        Write-Host "Then run this script again." -ForegroundColor Red
        exit 1
    }
    Write-Host "Logged in to Azure successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error checking Azure login status. Please ensure Azure CLI is installed." -ForegroundColor Red
    exit 1
}

# Create Resource Group
Write-Host "Creating Resource Group: $ResourceGroupName" -ForegroundColor Yellow
az group create --name $ResourceGroupName --location $Location

# Create SQL Server
Write-Host "Creating SQL Server: $SqlServerName" -ForegroundColor Yellow
az sql server create `
  --name $SqlServerName `
  --resource-group $ResourceGroupName `
  --location $Location `
  --admin-user $SqlAdminUser `
  --admin-password $SqlAdminPassword

# Create SQL Database
Write-Host "Creating SQL Database: $DatabaseName" -ForegroundColor Yellow
az sql db create `
  --resource-group $ResourceGroupName `
  --server $SqlServerName `
  --name $DatabaseName `
  --service-objective Basic

# Configure firewall rule (Allow Azure Services)
Write-Host "Configuring SQL Server Firewall" -ForegroundColor Yellow
az sql server firewall-rule create `
  --resource-group $ResourceGroupName `
  --server $SqlServerName `
  --name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0

# Create App Service Plan
Write-Host "Creating App Service Plan" -ForegroundColor Yellow
az appservice plan create `
  --name "$AppServiceName-plan" `
  --resource-group $ResourceGroupName `
  --location $Location `
  --sku B1

# Create Web App
Write-Host "Creating Web App: $AppServiceName" -ForegroundColor Yellow
az webapp create `
  --resource-group $ResourceGroupName `
  --plan "$AppServiceName-plan" `
  --name $AppServiceName `
  --runtime "DOTNET|8.0"

# Configure connection string
Write-Host "Configuring App Settings" -ForegroundColor Yellow
$connectionString = "Server=tcp:${SqlServerName}.database.windows.net,1433;Initial Catalog=${DatabaseName};Persist Security Info=False;User ID=${SqlAdminUser};Password=${SqlAdminPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

az webapp config connection-string set `
  --resource-group $ResourceGroupName `
  --name $AppServiceName `
  --connection-string-type SQLServer `
  --settings "DefaultConnection=$connectionString"

# Set environment
az webapp config appsettings set `
  --resource-group $ResourceGroupName `
  --name $AppServiceName `
  --settings ASPNETCORE_ENVIRONMENT=Production

Write-Host "Azure resources created successfully!" -ForegroundColor Green
Write-Host "SQL Server: $SqlServerName.database.windows.net" -ForegroundColor Cyan
Write-Host "Database: $DatabaseName" -ForegroundColor Cyan
Write-Host "Web App URL: https://$AppServiceName.azurewebsites.net" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Build and publish API:" -ForegroundColor White
Write-Host "   cd UserManagementAPI" -ForegroundColor Gray
Write-Host "   dotnet publish -c Release -o ./publish" -ForegroundColor Gray
Write-Host "   Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip" -ForegroundColor Gray

Write-Host "2. Deploy to Azure:" -ForegroundColor White
Write-Host "   az webapp deployment source config-zip --resource-group $ResourceGroupName --name $AppServiceName --src ./publish.zip" -ForegroundColor Gray

Write-Host "3. Run database migrations:" -ForegroundColor White
Write-Host "   az webapp ssh --resource-group $ResourceGroupName --name $AppServiceName" -ForegroundColor Gray
Write-Host "   cd /home/site/wwwroot" -ForegroundColor Gray
Write-Host "   dotnet ef database update" -ForegroundColor Gray

# Save deployment info
$deploymentInfo = @{
    ResourceGroup = $ResourceGroupName
    SqlServer = $SqlServerName
    Database = $DatabaseName
    AppService = $AppServiceName
    WebAppUrl = "https://$AppServiceName.azurewebsites.net"
    ConnectionString = $connectionString
} | ConvertTo-Json

$deploymentInfo | Out-File -FilePath "deployment-info.json" -Encoding UTF8
Write-Host "`nDeployment information saved to deployment-info.json" -ForegroundColor Green
