import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDepartment, setNewDepartment] = useState({
        name: ''
    });

    // Fetch departments on component mount
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/departments/')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDepartment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add new department (POST to backend and update frontend)
    const handleAddDepartment = (e) => {
        e.preventDefault();

        // Send a POST request to the backend API to add the new department
        axios.post('http://127.0.0.1:8000/departments/', newDepartment)
            .then(response => {
                setDepartments(prev => [...prev, response.data]);
                setNewDepartment({
                    name: ''
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('Error adding department:', error);
            });
    };

    return (
        <div className="container mt-4">
            <h1 className="d-flex align-items-center">
                Department List
                <button className="btn btn-primary ms-3" onClick={() => setIsModalOpen(true)}>
                    Add New Department
                </button>
            </h1>

            {/* Department List */}
            {departments.length > 0 ? (
                departments.map(department => (
                    <div key={department.id} className="card mb-4">
                        <div className="custom-card-header card-header">
                            <strong>{department.name}</strong>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div>ID: {department.id}</div>
                                    <div>Name: {department.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}

            {/* Modal */}
            <Modal show={isModalOpen} onHide={() => {
                setIsModalOpen(false);
                setNewDepartment({
                    name: ''
                });
            }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddDepartment}>
                        <Form.Group className="mb-3" controlId="formDepartmentName">
                            <Form.Label>Department Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newDepartment.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Department
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Department;
