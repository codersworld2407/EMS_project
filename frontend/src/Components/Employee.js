import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Employee = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        salary: '',
        address: '',
        department: '',
        designation: ''
    });
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/employees/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddEmployee = (e) => {
        e.preventDefault();

        const formattedEmployee = {
            name: newEmployee.name,
            salary: parseFloat(newEmployee.salary),
            address: newEmployee.address,
            designation: newEmployee.designation,
            department: parseInt(newEmployee.department)
        };

        axios.post('http://127.0.0.1:8000/employees/', formattedEmployee)
            .then(response => {
                setData(prev => [...prev, response.data]);
                setNewEmployee({
                    name: '',
                    salary: '',
                    address: '',
                    department: '',
                    designation: ''
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('Error adding employee:', error);
            });
    };

    const handleUpdateEmployee = (id) => {
        const employeeToUpdate = data.find(employee => employee.id === id);
        setSelectedEmployeeId(id);
        setNewEmployee({
            name: employeeToUpdate.name,
            salary: employeeToUpdate.salary,
            address: employeeToUpdate.address,
            designation: employeeToUpdate.designation,
            department: employeeToUpdate.department
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateEmployeeSubmit = (e) => {
        e.preventDefault();

        const updatedEmployee = {
            name: newEmployee.name,
            salary: parseFloat(newEmployee.salary),
            address: newEmployee.address,
            designation: newEmployee.designation,
            department: parseInt(newEmployee.department)
        };

        axios.put(`http://127.0.0.1:8000/employees/${selectedEmployeeId}`, updatedEmployee)
            .then(response => {
                setData(prevData => prevData.map(employee => {
                    if (employee.id === selectedEmployeeId) {
                        return { ...employee, ...updatedEmployee };
                    }
                    return employee;
                }));
                setIsUpdateModalOpen(false);
                setSelectedEmployeeId(null);
            })
            .catch(error => {
                console.error('Error updating employee:', error);
            });
    };

    const handleDeleteEmployee = (id) => {
        axios.delete(`http://127.0.0.1:8000/employees/${id}`)
            .then(() => {
                setData(prevData => prevData.filter(employee => employee.id !== id));
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
            });
    };

    return (
        <div className="container mt-4">
            <h1 className="d-flex align-items-center">
                Employee Data
                <button className="btn btn-primary ms-3" onClick={() => setIsModalOpen(true)}>
                    Add New Employee
                </button>
            </h1>

            {/* Employee List */}
            {data.length > 0 ? (
                data.map(item => (
                    <div key={item.id} className="card mb-4 custom-card">
                        <div className="card-header custom-card-header">
                            <strong>{item.name}</strong> - {item.designation}
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div>ID: {item.id}</div>
                                    <div>Salary: ${item.salary}</div>
                                    <div>Address: {item.address}</div>
                                </div>
                                <div className="col-md-6">
                                    <div>Department: {item.department}</div>
                                </div>
                            </div>
                            {/* Delete Button */}
                            <div className="mt-3">
                                <Button variant="danger" onClick={() => handleDeleteEmployee(item.id)}>
                                    Delete Employee
                                </Button>
                                {/* Update Button */}
                                <Button variant="warning" className="ms-2" onClick={() => handleUpdateEmployee(item.id)}>
                                    Update Employee
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}

            {/* Modal for Adding New Employee */}
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddEmployee}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newEmployee.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formSalary">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                name="salary"
                                value={newEmployee.salary}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={newEmployee.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={newEmployee.department}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDesignation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                name="designation"
                                value={newEmployee.designation}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Employee
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Updating Employee */}
            <Modal show={isUpdateModalOpen} onHide={() => setIsUpdateModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateEmployeeSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newEmployee.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formSalary">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                name="salary"
                                value={newEmployee.salary}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={newEmployee.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                name="department"
                                value={newEmployee.department}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDesignation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                name="designation"
                                value={newEmployee.designation}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Update Employee
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Employee;
