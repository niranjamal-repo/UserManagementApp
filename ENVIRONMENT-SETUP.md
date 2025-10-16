# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the `user-management-frontend` directory with the following content:

### Development Environment (.env)
```
REACT_APP_API_URL=https://localhost:7000/api/users
```

### Production Environment (.env.production)
```
REACT_APP_API_URL=https://your-api-domain.azurewebsites.net/api/users
```

## Backend CORS Configuration

Update the `AllowedOrigins` section in your `appsettings.json` and `appsettings.Production.json` files to include your frontend domain.

### Development (appsettings.json)
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "https://localhost:3000"
  ]
}
```

### Production (appsettings.Production.json)
```json
{
  "AllowedOrigins": [
    "https://your-frontend-domain.com",
    "https://localhost:3000"
  ]
}
```

## Running the Application

### Backend (API)
```bash
cd UserManagementAPI
dotnet run
```

### Frontend
```bash
cd user-management-frontend
npm install
npm start
```

## Deployment Notes

1. Make sure to update the CORS origins for production
2. Set the correct API URL in your frontend environment variables
3. Ensure your database connection strings are properly configured
4. Run database migrations after deployment

## Security Improvements Made

- Added input validation for mobile numbers
- Enhanced CORS configuration for production
- Added email uniqueness validation
- Improved error handling in API endpoints
- Added model validation checks
