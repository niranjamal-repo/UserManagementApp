using Microsoft.EntityFrameworkCore;
using UserManagementAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Temporarily comment out Entity Framework to test basic functionality
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline - MINIMAL VERSION
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "User Management API V1");
    c.RoutePrefix = "swagger";
});

// Remove HTTPS redirection temporarily
// app.UseHttpsRedirection();

// Remove CORS temporarily
// app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();
