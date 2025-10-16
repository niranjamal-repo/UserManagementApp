# Azure Deployment Guide

This guide provides step-by-step instructions for deploying the User Management Application to Azure.

## Prerequisites

- Azure subscription
- Azure CLI installed and configured
- PowerShell (for Windows) or Bash (for Linux/Mac)
- Git repository with the application code

## Option 1: Automated Deployment with PowerShell Script

### Step 1: Install Azure PowerShell Module

```powershell
# Install Azure PowerShell module
Install-Module -Name Az -AllowClobber -Force

# Login to Azure
Connect-AzAccount
```

### Step 2: Run Deployment Script

```powershell
# Navigate to project directory
cd UserManagementApp

# Run deployment script with your parameters
.\azure-deploy.ps1 -ResourceGroupName "user-management-rg" -AppServiceName "user-management-api" -SqlServerName "user-management-sql" -DatabaseName "UserManagementDB" -Location "Australia Southeast"
```

### Step 3: Configure Connection String

After deployment, update the connection string in Azure App Service:

1. Go to Azure Portal → App Services → Your App Service
2. Navigate to Configuration → Connection strings
3. Add new connection string:
   - Name: `DefaultConnection`
   - Value: `Server=tcp:user-management-sql.database.windows.net,1433;Initial Catalog=UserManagementDB;Persist Security Info=False;User ID=your-admin;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`
   - Type: `SQLServer`

## Option 2: Manual Deployment

### Step 1: Create Resource Group

```bash
# Using Azure CLI
az group create --name user-management-rg --location "Australia Southeast"
```

### Step 2: Create SQL Server and Database

```bash
# Create SQL Server
az sql server create \
  --name user-management-sql \
  --resource-group user-management-rg \
  --location "Australia Southeast" \
  --admin-user sqladmin \
  --admin-password YourPassword123!

# Create SQL Database
az sql db create \
  --resource-group user-management-rg \
  --server user-management-sql \
  --name UserManagementDB \
  --service-objective Basic

# Configure firewall rule
az sql server firewall-rule create \
  --resource-group user-management-rg \
  --server user-management-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 3: Create App Service Plan and Web App

```bash
# Create App Service Plan
az appservice plan create \
  --name user-management-plan \
  --resource-group user-management-rg \
  --location "Australia Southeast" \
  --sku B1

# Create Web App
az webapp create \
  --resource-group user-management-rg \
  --plan user-management-plan \
  --name user-management-api \
  --runtime "DOTNET|9.0"
```

### Step 4: Configure App Settings

```bash
# Set connection string
az webapp config connection-string set \
  --resource-group user-management-rg \
  --name user-management-api \
  --connection-string-type SQLServer \
  --settings DefaultConnection="Server=tcp:user-management-sql.database.windows.net,1433;Initial Catalog=UserManagementDB;Persist Security Info=False;User ID=sqladmin;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Set environment
az webapp config appsettings set \
  --resource-group user-management-rg \
  --name user-management-api \
  --settings ASPNETCORE_ENVIRONMENT=Production
```

### Step 5: Deploy Application

```bash
# Build and publish application
cd UserManagementAPI
dotnet publish -c Release -o ./publish

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group user-management-rg \
  --name user-management-api \
  --src ./publish.zip
```

## Option 3: GitHub Actions CI/CD

### Step 1: Prepare Azure Resources

Follow Option 2 steps 1-4 to create Azure resources.

### Step 2: Get Publish Profile

1. Go to Azure Portal → App Services → user-management-api
2. Navigate to Deployment Center → Local Git/FTPS credentials
3. Download the publish profile file
4. Copy the contents

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add new secret:
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste the publish profile content

### Step 4: Deploy

```bash
# Commit and push to main branch
git add .
git commit -m "Setup CI/CD deployment"
git push origin main
```

The GitHub Action will automatically build and deploy your application.

## Post-Deployment Steps

### 1. Run Database Migrations

```bash
# Connect to your App Service and run migrations
az webapp ssh --resource-group user-management-rg --name user-management-api
cd /home/site/wwwroot
dotnet ef database update
```

### 2. Test the API

```bash
# Test the API endpoints
curl https://user-management-api.azurewebsites.net/api/users
```

### 3. Update Frontend Configuration

Update the API URL in your React application:

```javascript
// In user-management-frontend/src/services/userService.js
const API_URL = 'https://user-management-api.azurewebsites.net/api/users';
```

## Monitoring and Troubleshooting

### Application Logs

```bash
# Stream application logs
az webapp log tail --resource-group user-management-rg --name user-management-api
```

### Database Connection Issues

1. Check connection string format
2. Verify SQL Server firewall rules
3. Ensure database exists and is accessible

### Deployment Issues

1. Check GitHub Actions logs
2. Review App Service deployment logs
3. Verify all required environment variables are set

## Cost Optimization

- Use Basic tier for App Service Plan (B1)
- Use Basic tier for SQL Database
- Consider using Azure Container Instances for lower costs
- Monitor usage with Azure Cost Management

## Security Considerations

- Use Azure Key Vault for sensitive configuration
- Enable HTTPS only
- Configure proper CORS policies
- Use managed identities where possible
- Regular security updates and monitoring

## Scaling

- Upgrade to Standard tier for better performance
- Use Azure SQL Database elastic pools for cost efficiency
- Implement Application Insights for monitoring
- Consider Azure CDN for global distribution

---

For additional support, refer to the main README.md file or create an issue in the GitHub repository.
