import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []); // Fetch patients when component mounts

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients'); // Adjust the URL based on your backend routes
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleAddOrUpdatePatient = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/patients/${editingPatient.id}`, newPatient);
                setEditingPatient(null);
                setIsEditing(false);
            } else {
                await axios.post('http://127.0.0.1:8000/api/addPatients', newPatient);
            }
            setNewPatient({
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
            fetchPatients(); // Refresh patients after adding or updating
        } catch (error) {
            console.error('Error adding/updating patient:', error);
        }
    };

    const handleEditPatient = (id) => {
        const patientToEdit = patients.find(patient => patient.id === id);
        setEditingPatient(patientToEdit);
        setIsEditing(true);
        setNewPatient(patientToEdit);
    };

    const handleDeletePatient = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removePatient/${id}`);
            fetchPatients(); // Refresh patients after deletion
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    return (
     <div className="container">
    <div className="row mt-4">
        <div className="col-lg-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">{isEditing ? 'Edit Patient' : 'Add New Patient'}</h4>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="first_name" className="form-label">First Name</label>
                            <input type="text" id="first_name" className="form-control" name="first_name" value={newPatient.first_name} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">Last Name</label>
                            <input type="text" id="last_name" className="form-control" name="last_name" value={newPatient.last_name} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                            <input type="date" id="date_of_birth" className="form-control" name="date_of_birth" value={newPatient.date_of_birth} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <input type="text" id="gender" className="form-control" name="gender" value={newPatient.gender} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" id="address" className="form-control" name="address" value={newPatient.address} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" id="phone" className="form-control" name="phone" value={newPatient.phone} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" id="email" className="form-control" name="email" value={newPatient.email} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="emergency_contact" className="form-label">Emergency Contact</label>
                            <input type="text" id="emergency_contact" className="form-control" name="emergency_contact" value={newPatient.emergency_contact} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="medical_history" className="form-label">Medical History</label>
                            <textarea id="medical_history" className="form-control" name="medical_history" value={newPatient.medical_history} onChange={handleInputChange}></textarea>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddOrUpdatePatient}>{isEditing ? 'Update Patient' : 'Add Patient'}</button>
                    </form>
                </div>
            </div>
        </div>
        <div className="col-lg-8">
            <div className="card">
                <div className="card-header bg-info text-white">
                    <h4 className="mb-0">Patient List</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Date of Birth</th>
                                    <th>Gender</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(patient => (
                                    <tr key={patient.id}>
                                        <td>{patient.first_name} {patient.last_name}</td>
                                        <td>{patient.date_of_birth}</td>
                                        <td>{patient.gender}</td>
                                        <td>
                                            <button className="btn btn-info btn-sm me-1" onClick={() => handleEditPatient(patient.id)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletePatient(patient.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    );
};

export default PatientManagement;
