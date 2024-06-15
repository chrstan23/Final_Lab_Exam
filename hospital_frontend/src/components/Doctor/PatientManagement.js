import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [editingPatient, setEditingPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        emergency_contact: '',
        medical_history: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setNewPatient(patient);
        // Trigger modal for editing
    };

    const handleUpdatePatient = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/patients/${editingPatient.id}`, newPatient);
            setEditingPatient(null);
            // Close modal for editing
            fetchPatients(); // Refresh patient list
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    return (
<div className="container mt-4">
        <h3>Patient List</h3>
        <div>
            {/* Modal for editing patient information */}
            {editingPatient && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Patient</h4>
                                <button type="button" className="close" aria-label="Close" onClick={() => handleUpdatePatient(null)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Input fields for editing patient */}
                                <div className="form-group">
                                    {/* Add your input fields here */}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => handleUpdatePatient(null)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdatePatient}>Update Patient</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="table-responsive mt-4">
            {/* Table to display patients */}
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Emergency Contact</th>
                        <th>Medical History</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id} onClick={() => handleEditPatient(patient)}>
                            <td>{patient.first_name} {patient.last_name}</td>
                            <td>{patient.date_of_birth}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.address}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.email}</td>
                            <td>{patient.emergency_contact}</td>
                            <td>{patient.medical_history}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default PatientManagement;
