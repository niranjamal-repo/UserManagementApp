# User Management Application

A full-stack web application for managing users with a React frontend and .NET Core Web API backend, designed for deployment on Azure.

## 🏗️ Architecture

- **Frontend**: React with Bootstrap UI
- **Backend**: .NET 8.0 Web API
- **Database**: Azure SQL Database
- **Deployment**: Azure App Service
- **CI/CD**: GitHub Actions

## 📋 Features

- ✅ Create, Read, Update, Delete (CRUD) operations for users
- ✅ User fields: First Name, Last Name, Mobile, Email, Address
- ✅ **Input validation and filtering** for names (letters, spaces, hyphens, apostrophes only)
- ✅ **Mobile number validation** (numeric values only, maximum 12 characters)
- ✅ Real-time form validation with user-friendly error messages
- ✅ Responsive Bootstrap UI
- ✅ RESTful API endpoints
- ✅ Entity Framework Core with SQL Server
- ✅ Azure deployment ready
- ✅ GitHub Actions CI/CD pipeline

## 🚀 Quick Start

### Prerequisites

- .NET 8.0 SDK
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

## ✅ Data Validation

### Name Field Validation

The application enforces strict validation for First Name and Last Name fields:

#### ✅ **Allowed Characters**
- Letters (a-z, A-Z)
- Spaces (for compound names like "Mary Jane")
- Hyphens (for names like "Anne-Marie")
- Apostrophes (for names like "O'Connor")

#### ❌ **Blocked Characters**
- Numbers (0-9)
- Special symbols (@, #, $, %, etc.)
- Punctuation marks (., !, ?, etc.)

#### 🔧 **Validation Features**

**Frontend (React):**
- **Real-time input filtering**: Invalid characters are automatically removed as you type
- **Paste protection**: Pasted content is filtered to remove invalid characters
- **Instant validation feedback**: Error messages appear immediately
- **User-friendly placeholders**: Clear guidance on allowed characters

**Backend (.NET Core):**
- **Server-side validation**: Regular expression validation using `[RegularExpression]` attributes
- **API-level protection**: Invalid data is rejected before reaching the database
- **Detailed error messages**: Clear feedback about validation failures

#### 📝 **Validation Examples**

**Valid Names:**
```
John
Mary Jane
Anne-Marie
O'Connor
José
Jean-Pierre
```

**Invalid Names (automatically filtered/blocked):**
```
John123     ❌ Numbers removed
Mary@Jane   ❌ Special characters removed
John.Smith  ❌ Punctuation removed
```

### Mobile Number Validation

The application enforces strict validation for Mobile Number fields:

#### ✅ **Allowed Format**
- **Numeric values only**: 0-9 digits
- **Maximum length**: 12 characters
- **No special characters**: No spaces, hyphens, parentheses, or country codes

#### ❌ **Blocked Characters**
- Letters (a-z, A-Z)
- Special symbols (@, #, $, %, etc.)
- Punctuation marks (., !, ?, etc.)
- Spaces and hyphens
- Country codes (+1, +44, etc.)

#### 🔧 **Validation Features**

**Frontend (React):**
- **Real-time input filtering**: Only numeric characters are allowed as you type
- **Length limiting**: Input is automatically limited to 12 characters
- **Paste protection**: Pasted content is filtered to remove non-numeric characters
- **Instant validation feedback**: Error messages appear immediately
- **User-friendly placeholders**: Clear guidance on allowed format

**Backend (.NET Core):**
- **Server-side validation**: Regular expression validation using `^[0-9]{1,12}$` pattern
- **API-level protection**: Invalid data is rejected before reaching the database
- **Detailed error messages**: Clear feedback about validation failures

#### 📝 **Validation Examples**

**Valid Mobile Numbers:**
```
1234567890
9876543210
123456789012
5551234567
```

**Invalid Mobile Numbers (automatically filtered/blocked):**
```
123-456-7890    ❌ Hyphens removed
(555) 123-4567  ❌ Parentheses and spaces removed
+1-555-123-4567 ❌ Country code and special chars removed
555abc1234      ❌ Letters removed
1234567890123   ❌ Truncated to 12 characters
```

## ☁️ Azure Deployment

### Current Live Application

- **Frontend**: [http://user-management-frontend.azurewebsites.net](http://user-management-frontend.azurewebsites.net)
- **API**: [https://user-management-api.azurewebsites.net/api/users](https://user-management-api.azurewebsites.net/api/users)
- **API Documentation**: [https://user-management-api.azurewebsites.net/swagger](https://user-management-api.azurewebsites.net/swagger)

### Option 1: GitHub Actions CI/CD (Recommended)

The application is configured with automatic deployment via GitHub Actions:

1. **Set up GitHub Secrets**
   - `AZURE_CREDENTIALS`: Service principal credentials for Azure authentication
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Publish profile for API deployment

2. **Automatic Deployment**
   - Push to `main` branch triggers automatic deployment
   - Both API and Frontend are deployed automatically
   - Database migrations are applied automatically

3. **Monitor deployment**
   - Check GitHub Actions tab for deployment progress
   - View logs in Azure App Service

### Option 2: Using PowerShell Script

1. **Install Azure PowerShell Module**
   ```powershell
   Install-Module -Name Az -AllowClobber
   ```

2. **Run the deployment script**
   ```powershell
   .\azure-deploy.ps1 -ResourceGroupName "user-management-rg" -AppServiceName "user-management-api" -SqlServerName "user-management-sql" -DatabaseName "UserManagementDB" -Location "Central US"
   ```

### Option 3: Manual Azure Setup

1. **Create Azure Resources**
   - Resource Group: `user-management-rg`
   - App Service Plan (Basic tier)
   - API Web App: `user-management-api` (.NET 8.0)
   - Frontend Web App: `user-management-frontend` (Node.js 20)
   - SQL Server: `user-management-sql`
   - SQL Database: `UserManagementDB` (Basic tier)

2. **Configure Connection String**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=tcp:user-management-sql.database.windows.net,1433;Initial Catalog=UserManagementDB;Persist Security Info=False;User ID=sqladmin;Password=UserManagement2024!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
     }
   }
   ```

3. **Deploy the Application**
   ```bash
   dotnet publish -c Release
   # Deploy the published files to Azure App Service
   ```

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
- **Name fields have strict validation**: Only letters, spaces, hyphens, and apostrophes allowed
- **Mobile fields have strict validation**: Only numeric values, maximum 12 characters
- **Real-time input filtering**: Invalid characters are automatically removed as users type
- All timestamps are in UTC
- Bootstrap 5 is used for responsive UI components
- **Dual validation**: Both frontend (React) and backend (.NET) validation for data integrity

## 🔄 Recent Updates & Fixes

### Latest Improvements (October 2025)

- ✅ **Fixed CORS Issues**: Updated CORS policy to allow both HTTP and HTTPS frontend URLs
- ✅ **Fixed PUT Request Handling**: Resolved 400 Bad Request errors by including user ID in request body
- ✅ **Added Express Server**: Frontend now uses Express.js server for proper static file serving on Azure
- ✅ **Database Authentication**: Switched from Azure AD to SQL authentication for better compatibility
- ✅ **Mobile Number Validation**: Enhanced validation with real-time filtering and length limiting
- ✅ **GitHub Actions CI/CD**: Automated deployment pipeline for both API and Frontend
- ✅ **Error Handling**: Improved error handling and user feedback throughout the application

### Technical Architecture

- **Frontend**: React with Express.js server for Azure App Service deployment
- **Backend**: .NET 8.0 Web API with Entity Framework Core
- **Database**: Azure SQL Database with SQL authentication
- **Deployment**: GitHub Actions with automatic CI/CD pipeline
- **CORS**: Configured to allow requests from both HTTP and HTTPS frontend URLs

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
