import React from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';

const UserList = ({ users, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Alert variant="info">
        No users found. Click "Add New User" to get started.
      </Alert>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Address</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.mobile}</td>
            <td>{user.address}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onEdit(user)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserList;
