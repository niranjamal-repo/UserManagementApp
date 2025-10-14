# User Management Application

A full-stack web application for managing users with a React frontend and .NET Core Web API backend, designed for deployment on Azure.

## 🏗️ Architecture

- **Frontend**: React with Bootstrap UI
- **Backend**: .NET Core 9.0 Web API
- **Database**: Azure SQL Database
- **Deployment**: Azure App Service
- **CI/CD**: GitHub Actions

## 📋 Features

- ✅ Create, Read, Update, Delete (CRUD) operations for users
- ✅ User fields: First Name, Last Name, Mobile, Email, Address
- ✅ Responsive Bootstrap UI
- ✅ RESTful API endpoints
- ✅ Entity Framework Core with SQL Server
- ✅ Azure deployment ready
- ✅ GitHub Actions CI/CD pipeline

## 🚀 Quick Start

### Prerequisites

- .NET 9.0 SDK
- Node.js 18+ and npm
- SQL Server LocalDB (for local development)
- Azure CLI (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UserManagementApp
   ```

2. **Backend Setup**
   ```bash
   cd UserManagementAPI
   dotnet restore
   dotnet ef database update
   dotnet run
   ```
   The API will be available at `https://localhost:7000`

3. **Frontend Setup**
   ```bash
   cd user-management-frontend
   npm install
   npm start
   ```
   The React app will be available at `http://localhost:3000`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### API Documentation

Once the backend is running, visit `https://localhost:7000/swagger` for interactive API documentation.

## ☁️ Azure Deployment

### Option 1: Using PowerShell Script

1. **Install Azure PowerShell Module**
   ```powershell
   Install-Module -Name Az -AllowClobber
   ```

2. **Run the deployment script**
   ```powershell
   .\azure-deploy.ps1 -ResourceGroupName "user-management-rg" -AppServiceName "user-management-api" -SqlServerName "user-management-sql" -DatabaseName "UserManagementDB" -Location "East US"
   ```

### Option 2: Manual Azure Setup

1. **Create Azure Resources**
   - Resource Group
   - App Service Plan (Basic tier)
   - Web App (.NET 9.0)
   - SQL Server
   - SQL Database (Basic tier)

2. **Configure Connection String**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=tcp:your-server.database.windows.net,1433;Initial Catalog=UserManagementDB;Persist Security Info=False;User ID=your-username;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
     }
   }
   ```

3. **Deploy the Application**
   ```bash
   dotnet publish -c Release
   # Deploy the published files to Azure App Service
   ```

### Option 3: GitHub Actions CI/CD

1. **Set up GitHub Secrets**
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Get from Azure App Service → Deployment → Deployment Center

2. **Push to main branch**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

3. **Monitor deployment**
   - Check GitHub Actions tab for deployment progress
   - View logs in Azure App Service

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Environment (Development/Production) | Development |
| `ConnectionStrings__DefaultConnection` | SQL Server connection string | LocalDB |

### CORS Configuration

The API is configured to allow requests from `http://localhost:3000` for local development. For production, update the CORS policy in `Program.cs`.

## 📁 Project Structure

```
UserManagementApp/
├── UserManagementAPI/              # .NET Core Web API
│   ├── Controllers/                # API Controllers
│   ├── Data/                       # Entity Framework DbContext
│   ├── Models/                     # Data Models
│   ├── Migrations/                 # EF Core Migrations
│   └── Program.cs                  # Application Entry Point
├── user-management-frontend/       # React Frontend
│   ├── src/
│   │   ├── components/             # React Components
│   │   ├── services/               # API Service Layer
│   │   └── App.js                  # Main App Component
│   └── package.json
├── .github/workflows/              # GitHub Actions
├── azure-deploy.ps1               # Azure Deployment Script
└── README.md
```

## 🧪 Testing

### Backend Testing
```bash
cd UserManagementAPI
dotnet test
```

### Frontend Testing
```bash
cd user-management-frontend
npm test
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure SQL Server LocalDB is installed
   - Check connection string in `appsettings.json`
   - Run `dotnet ef database update` to create/update database

2. **CORS Issues**
   - Verify CORS policy allows your frontend URL
   - Check browser developer tools for CORS errors

3. **Azure Deployment Issues**
   - Verify Azure resources are created correctly
   - Check connection string format for Azure SQL
   - Review deployment logs in Azure App Service

4. **Frontend API Connection Issues**
   - Update API URL in `userService.js`
   - Ensure backend is running on correct port
   - Check for HTTPS/HTTP mismatch

## 📝 Development Notes

- The application uses Entity Framework Core Code First approach
- Database migrations are automatically applied on startup
- Email field has a unique constraint
- All timestamps are in UTC
- Bootstrap 5 is used for responsive UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review Azure App Service logs for deployment issues

---

**Happy Coding! 🎉**
