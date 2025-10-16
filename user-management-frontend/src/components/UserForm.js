import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{1,12}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must contain only numeric values and be maximum 12 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Filter input to only allow valid name characters
  const filterNameInput = (value) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    return value.replace(/[^a-zA-Z\s\-']/g, '');
  };

  // Filter input to only allow numeric characters for mobile
  const filterMobileInput = (value) => {
    // Only allow numbers and limit to 12 characters
    return value.replace(/[^0-9]/g, '').slice(0, 12);
  };

  // Handle paste events to filter pasted content
  const handlePaste = (e) => {
    const { name } = e.target;
    if (name === 'firstName' || name === 'lastName') {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const filteredText = filterNameInput(pastedText);
      setFormData(prev => ({
        ...prev,
        [name]: filteredText
      }));
    } else if (name === 'mobile') {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData('text');
      const filteredText = filterMobileInput(pastedText);
      setFormData(prev => ({
        ...prev,
        [name]: filteredText
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Filter input for specific fields to prevent invalid characters
    let filteredValue = value;
    if (name === 'firstName' || name === 'lastName') {
      filteredValue = filterNameInput(value);
    } else if (name === 'mobile') {
      filteredValue = filterMobileInput(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));
    
    // Real-time validation for names
    if (name === 'firstName' || name === 'lastName') {
      if (filteredValue && !/^[a-zA-Z\s\-']*$/.test(filteredValue)) {
        setErrors(prev => ({
          ...prev,
          [name]: `${name === 'firstName' ? 'First' : 'Last'} name can only contain letters, spaces, hyphens, and apostrophes`
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
      // Clear error for other fields when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h3>{user ? 'Edit User' : 'Add New User'}</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  isInvalid={!!errors.firstName}
                  placeholder="Enter first name (letters only)"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  isInvalid={!!errors.lastName}
                  placeholder="Enter last name (letters only)"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mobile *</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  isInvalid={!!errors.mobile}
                  placeholder="Enter mobile number (numbers only, max 12 digits)"
                  maxLength={12}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (user ? 'Update User' : 'Create User')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;
