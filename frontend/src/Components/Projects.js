import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        team_lead: '',
        status: '',
        start_date: '',
        end_date: '',
        team: ''
    });
    const [statusModalOpen, setStatusModalOpen] = useState(false); // For update status modal
    const [selectedProjectId, setSelectedProjectId] = useState(null); // Selected project to update
    const [newStatus, setNewStatus] = useState(''); // New status to set

    // Fetch projects on component mount
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/projects/')
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the projects!", error);
            });
    }, []);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add project (POST to backend and update frontend)
    const handleAddProject = (e) => {
        e.preventDefault();

        // Format the new project data to match the backend's expected structure
        const formattedProject = {
            name: newProject.name,
            team_lead: parseInt(newProject.team_lead),
            status: newProject.status,
            start_date: newProject.start_date,
            end_date: newProject.end_date,
            team: newProject.team
                .split(',')
                .map(member => parseInt(member.trim())) // Convert to an array of integers
        };

        // Send a POST request to the backend API to add the new project
        axios.post('http://127.0.0.1:8000/projects/', formattedProject)
            .then(response => {
                setProjects(prev => [...prev, response.data]);
                setNewProject({
                    name: '',
                    team_lead: '',
                    status: '',
                    start_date: '',
                    end_date: '',
                    team: ''
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error('Error adding project:', error);
            });
    };

    // Open the update status modal
    const handleUpdateStatusClick = (projectId, currentStatus) => {
        setSelectedProjectId(projectId);
        setNewStatus(currentStatus);
        setStatusModalOpen(true);
    };

    // Handle status update (PUT request)
    const handleStatusUpdate = () => {
        if (!newStatus || !selectedProjectId) {
            alert('Please select a valid status and project.');
            return;
        }

        const updatedProject = {
            status: newStatus
        };

        axios.put(`http://127.0.0.1:8000/projects/${selectedProjectId}`, updatedProject)
            .then(response => {
                // Update the projects list with the new status (optimistic UI update)
                setProjects(prevProjects => {
                    return prevProjects.map(project => {
                        if (project.id === selectedProjectId) {
                            return { ...project, status: newStatus };
                        }
                        return project;
                    });
                });
                setStatusModalOpen(false);
                setSelectedProjectId(null);
                setNewStatus('');
            })
            .catch(error => {
                console.error('Error updating project status:', error);
            });
    };

    return (
        <div className="container mt-4">
            <h1 className="d-flex align-items-center">
                Project Data
                <button className="btn btn-primary ms-3" onClick={() => setIsModalOpen(true)}>
                    Add New Project
                </button>
            </h1>

            {/* Project List */}
            {projects.length > 0 ? (
                projects.map(project => (
                    <div key={project.id} className="card mb-4">
                        <div className="custom-card-header card-header">
                            <strong>{project.name}</strong> - {project.status}
                        </div>
                        <div className="custom-card card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div><strong>ID:</strong> {project.id}</div>
                                    <div><strong>Team Lead:</strong> {project.team_lead}</div>
                                    <div><strong>Status:</strong> {project.status}</div>
                                    <div><strong>Start Date:</strong> {project.start_date}</div>
                                    <div><strong>End Date:</strong> {project.end_date}</div>
                                </div>
                                <div className="col-md-6">
                                    <div><strong>Team:</strong></div>
                                    <ul>
                                        {project.team.map((member, index) => (
                                            <li key={index}> {/* Added key to each list item */}
                                                Team Member ID: {member}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Update Status Button */}
                            <div className="mt-3">
                                <Button
                                    variant="warning"
                                    onClick={() => handleUpdateStatusClick(project.id, project.status)}
                                >
                                    Update Status
                                </Button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading projects...</p>
            )}

            {/* Modal for Updating Project Status */}
            <Modal show={statusModalOpen} onHide={() => setStatusModalOpen(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Project Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="NEW">NEW</option>
                                <option value="ON-GOING">ON-GOING</option>
                                <option value="ENDED">ENDED</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" onClick={handleStatusUpdate}>
                            Update Status
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Adding New Project */}
            <Modal show={isModalOpen} onHide={() => {
                setIsModalOpen(false);
                setNewProject({
                    name: '',
                    team_lead: '',
                    status: '',
                    start_date: '',
                    end_date: '',
                    team: ''
                });
            }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddProject}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newProject.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTeamLead">
                            <Form.Label>Team Lead</Form.Label>
                            <Form.Control
                                type="number"
                                name="team_lead"
                                value={newProject.team_lead}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                name="status"
                                value={newProject.status}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={newProject.start_date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={newProject.end_date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTeam">
                            <Form.Label>Team Members (IDs)</Form.Label>
                            <Form.Control
                                type="text"
                                name="team"
                                value={newProject.team}
                                onChange={handleInputChange}
                                placeholder="Enter team member IDs separated by commas"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Add Project
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
}

export default Projects;
