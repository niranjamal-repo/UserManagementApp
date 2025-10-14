# Azure Deployment Script for User Management App
# This script deploys the .NET Core API to Azure App Service

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$AppServiceName,
    
    [Parameter(Mandatory=$true)]
    [string]$SqlServerName,
    
    [Parameter(Mandatory=$true)]
    [string]$DatabaseName,
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "East US"
)

Write-Host "Starting Azure deployment..." -ForegroundColor Green

# Login to Azure (if not already logged in)
$context = Get-AzContext
if (-not $context) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    Connect-AzAccount
}

# Create Resource Group
Write-Host "Creating Resource Group: $ResourceGroupName" -ForegroundColor Yellow
New-AzResourceGroup -Name $ResourceGroupName -Location $Location -Force

# Create SQL Server
Write-Host "Creating SQL Server: $SqlServerName" -ForegroundColor Yellow
$sqlServer = New-AzSqlServer -ResourceGroupName $ResourceGroupName `
    -ServerName $SqlServerName `
    -Location $Location `
    -SqlAdministratorCredentials (Get-Credential -Message "Enter SQL Server admin credentials")

# Configure SQL Server Firewall (Allow Azure Services)
Write-Host "Configuring SQL Server Firewall" -ForegroundColor Yellow
New-AzSqlServerFirewallRule -ResourceGroupName $ResourceGroupName `
    -ServerName $SqlServerName `
    -FirewallRuleName "AllowAzureServices" `
    -StartIpAddress "0.0.0.0" `
    -EndIpAddress "0.0.0.0"

# Create SQL Database
Write-Host "Creating SQL Database: $DatabaseName" -ForegroundColor Yellow
New-AzSqlDatabase -ResourceGroupName $ResourceGroupName `
    -ServerName $SqlServerName `
    -DatabaseName $DatabaseName `
    -Edition "Basic" `
    -RequestedServiceObjectiveName "Basic"

# Create App Service Plan
Write-Host "Creating App Service Plan" -ForegroundColor Yellow
New-AzAppServicePlan -ResourceGroupName $ResourceGroupName `
    -Name "$AppServiceName-plan" `
    -Location $Location `
    -Tier "Basic"

# Create Web App
Write-Host "Creating Web App: $AppServiceName" -ForegroundColor Yellow
New-AzWebApp -ResourceGroupName $ResourceGroupName `
    -Name $AppServiceName `
    -AppServicePlan "$AppServiceName-plan" `
    -RuntimeStack "DOTNET|9.0"

# Get SQL Connection String
$sqlConnectionString = "Server=tcp:$SqlServerName.database.windows.net,1433;Initial Catalog=$DatabaseName;Persist Security Info=False;User ID=$($sqlServer.SqlAdministratorLogin);Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

Write-Host "Setting App Settings..." -ForegroundColor Yellow
Set-AzWebApp -ResourceGroupName $ResourceGroupName `
    -Name $AppServiceName `
    -AppSettings @{
        "ConnectionStrings__DefaultConnection" = $sqlConnectionString;
        "ASPNETCORE_ENVIRONMENT" = "Production"
    }

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "SQL Connection String: $sqlConnectionString" -ForegroundColor Cyan
Write-Host "Web App URL: https://$AppServiceName.azurewebsites.net" -ForegroundColor Cyan
Write-Host "Remember to update the connection string with the actual password!" -ForegroundColor Red
