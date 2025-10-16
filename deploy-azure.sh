#!/bin/bash
# Azure Deployment Script for User Management App
# Run these commands after getting an Azure subscription

# Variables - Customize these values
RESOURCE_GROUP="user-management-rg"
LOCATION="Australia Southeast"
SQL_SERVER_NAME="user-management-sql-$(date +%s)"  # Makes it unique
DATABASE_NAME="UserManagementDB"
SQL_ADMIN_USER="sqladmin"
SQL_ADMIN_PASSWORD="YourPassword123!"  # Change this!
APP_SERVICE_NAME="user-management-api-$(date +%s)"  # Makes it unique

echo "Starting Azure deployment..."

# Login to Azure (run this first)
echo "Please run: az login"
read -p "Press Enter after you've logged in to Azure..."

# Create Resource Group
echo "Creating Resource Group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# Create SQL Server
echo "Creating SQL Server: $SQL_SERVER_NAME"
az sql server create \
  --name $SQL_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --admin-user $SQL_ADMIN_USER \
  --admin-password $SQL_ADMIN_PASSWORD

# Create SQL Database
echo "Creating SQL Database: $DATABASE_NAME"
az sql db create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --name $DATABASE_NAME \
  --service-objective Basic

# Configure firewall rule (Allow Azure Services)
echo "Configuring SQL Server Firewall"
az sql server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create App Service Plan
echo "Creating App Service Plan"
az appservice plan create \
  --name "${APP_SERVICE_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION" \
  --sku B1

# Create Web App
echo "Creating Web App: $APP_SERVICE_NAME"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_SERVICE_NAME}-plan" \
  --name $APP_SERVICE_NAME \
  --runtime "DOTNET|9.0"

# Configure connection string
echo "Configuring App Settings"
az webapp config connection-string set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_NAME \
  --connection-string-type SQLServer \
  --settings DefaultConnection="Server=tcp:${SQL_SERVER_NAME}.database.windows.net,1433;Initial Catalog=${DATABASE_NAME};Persist Security Info=False;User ID=${SQL_ADMIN_USER};Password=${SQL_ADMIN_PASSWORD};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Set environment
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_NAME \
  --settings ASPNETCORE_ENVIRONMENT=Production

echo "Azure resources created successfully!"
echo "SQL Server: $SQL_SERVER_NAME.database.windows.net"
echo "Database: $DATABASE_NAME"
echo "Web App URL: https://$APP_SERVICE_NAME.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Deploy your API: cd UserManagementAPI && dotnet publish -c Release"
echo "2. Deploy to Azure: az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME --src ./publish.zip"
echo "3. Run migrations: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME"
