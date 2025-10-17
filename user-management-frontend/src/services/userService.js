import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://user-management-api.azurewebsites.net';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

builder.Services.AddCors(options =>
  {
      options.AddDefaultPolicy(
          policy =>
          {
              policy.WithOrigins("http://user-management-frontend.azurewebsites.net", 
                                 "https://user-management-frontend.azurewebsites.net")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
          });
  });

  app.UseCors();

export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const userDataWithId = { ...userData, id: id };
      const response = await api.put(`/api/users/${id}`, userDataWithId);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      await api.delete(`/api/users/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};
