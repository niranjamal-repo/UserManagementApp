import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import UserList from './UserList';
import UserForm from './UserForm';
import { userService } from '../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        setSuccess('User deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        await userService.updateUser(selectedUser.id, userData);
        setUsers(users.map(user => 
          user.id === selectedUser.id ? { ...userData, id: selectedUser.id } : user
        ));
        setSuccess('User updated successfully!');
      } else {
        // Create new user
        const newUser = await userService.createUser(userData);
        setUsers([...users, newUser]);
        setSuccess('User created successfully!');
      }
      setShowForm(false);
      setSelectedUser(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to save user. Please try again.');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">User Management</h1>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {!showForm ? (
            <>
              <div className="mb-3">
                <Button variant="primary" onClick={handleAddUser}>
                  Add New User
                </Button>
              </div>
              
              <UserList
                users={users}
                loading={loading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            </>
          ) : (
            <UserForm
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={handleCancelForm}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserManagement;
