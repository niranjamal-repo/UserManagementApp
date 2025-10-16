# Quick Azure Deployment Guide

## Prerequisites
- Azure subscription (get free one at https://azure.microsoft.com/free/)
- Azure CLI installed (✅ Done)
- Your project code

## Step 1: Get Azure Subscription
1. Go to https://azure.microsoft.com/free/
2. Sign up for a free Azure account (includes $200 credit)
3. Verify your account if prompted

## Step 2: Login to Azure
```bash
az login
```
- This will open a browser window for you to login
- Select your Azure account

## Step 3: Deploy Resources (Choose One Option)

### Option A: PowerShell Script (Recommended for Windows)
```powershell
cd UserManagementApp
.\deploy-azure.ps1
```

### Option B: Manual Commands
```bash
# Create Resource Group
az group create --name user-management-rg --location "Australia Southeast"

# Create SQL Server (change password!)
az sql server create \
  --name user-management-sql-12345 \
  --resource-group user-management-rg \
  --location "Australia Southeast" \
  --admin-user sqladmin \
  --admin-password YourPassword123!

# Create Database
az sql db create \
  --resource-group user-management-rg \
  --server user-management-sql-12345 \
  --name UserManagementDB \
  --service-objective Basic

# Allow Azure Services
az sql server firewall-rule create \
  --resource-group user-management-rg \
  --server user-management-sql-12345 \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

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
  --name user-management-api-12345 \
  --runtime "DOTNET|9.0"

# Set Connection String
az webapp config connection-string set \
  --resource-group user-management-rg \
  --name user-management-api-12345 \
  --connection-string-type SQLServer \
  --settings DefaultConnection="Server=tcp:user-management-sql-12345.database.windows.net,1433;Initial Catalog=UserManagementDB;Persist Security Info=False;User ID=sqladmin;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Set Environment
az webapp config appsettings set \
  --resource-group user-management-rg \
  --name user-management-api-12345 \
  --settings ASPNETCORE_ENVIRONMENT=Production
```

## Step 4: Deploy Your API
```bash
# Build the API
cd UserManagementAPI
dotnet publish -c Release -o ./publish

# Create zip file (Windows)
Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip

# Deploy to Azure
az webapp deployment source config-zip \
  --resource-group user-management-rg \
  --name user-management-api-12345 \
  --src ./publish.zip
```

## Step 5: Run Database Migrations
```bash
# Connect to your App Service
az webapp ssh --resource-group user-management-rg --name user-management-api-12345

# Inside the SSH session:
cd /home/site/wwwroot
dotnet ef database update
exit
```

## Step 6: Test Your API
Your API should now be available at:
```
https://user-management-api-12345.azurewebsites.net/api/users
```

## Step 7: Deploy Frontend (Optional)
You can deploy your React frontend to:
1. **Azure Static Web Apps** (recommended)
2. **Azure App Service** (separate web app)
3. **Netlify** or **Vercel** (free alternatives)

### For Azure Static Web Apps:
```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy from frontend directory
cd user-management-frontend
swa deploy --deployment-token YOUR_DEPLOYMENT_TOKEN
```

## Troubleshooting

### Common Issues:
1. **"No subscriptions found"** - You need an Azure subscription
2. **"Resource name already exists"** - Change the resource names to be unique
3. **"Connection timeout"** - Check firewall rules and connection string
4. **"Migration failed"** - Ensure Entity Framework is properly configured

### Check Logs:
```bash
# View application logs
az webapp log tail --resource-group user-management-rg --name user-management-api-12345

# View deployment logs
az webapp deployment log list --resource-group user-management-rg --name user-management-api-12345
```

## Cost Optimization
- Free tier SQL Database: 5 DTUs, 2GB storage
- Basic App Service Plan: $13.14/month
- Total estimated cost: ~$15-20/month

## Next Steps
1. Set up custom domain
2. Configure SSL certificate
3. Set up monitoring with Application Insights
4. Configure CI/CD pipeline
5. Set up backup policies
