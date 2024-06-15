import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        first_name: '',
        last_name: '',
        specialization: '',
        license_number: '',
        phone: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []); // Fetch doctors when component mounts

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors'); // Adjust the URL based on your backend routes
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleAddOrUpdateDoctor = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/doctors/${editingDoctor.id}`, newDoctor);
                setEditingDoctor(null);
                setIsEditing(false);
            } else {
                await axios.post('http://127.0.0.1:8000/api/addDoctors', newDoctor);
            }
            setNewDoctor({
                first_name: '',
                last_name: '',
                specialization: '',
                license_number: '',
                phone: '',
                email: ''
            });
            fetchDoctors(); // Refresh doctors after adding or updating
        } catch (error) {
            console.error('Error adding/updating doctor:', error);
        }
    };

    const handleEditDoctor = (id) => {
        const doctorToEdit = doctors.find(doctor => doctor.id === id);
        setEditingDoctor(doctorToEdit);
        setIsEditing(true);
        setNewDoctor(doctorToEdit);
    };

    const handleDeleteDoctor = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeDoctor/${id}`);
            fetchDoctors(); // Refresh doctors after deletion
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    return (
        <div className="container">
        <h3 className="mt-4">Doctor Management</h3>
        <div className="row mt-4">
            <div className="col-lg-4">
                <div className="card">
                    <h4 className="card-header bg-primary text-white">{isEditing ? 'Edit Doctor' : 'Add New Doctor'}</h4>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="first_name" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="first_name" placeholder="Enter first name" value={newDoctor.first_name} onChange={(e) => setNewDoctor({ ...newDoctor, first_name: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="last_name" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="last_name" placeholder="Enter last name" value={newDoctor.last_name} onChange={(e) => setNewDoctor({ ...newDoctor, last_name: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="specialization" className="form-label">Specialization</label>
                                <input type="text" className="form-control" id="specialization" placeholder="Enter specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="license_number" className="form-label">License Number</label>
                                <input type="text" className="form-control" id="license_number" placeholder="Enter license number" value={newDoctor.license_number} onChange={(e) => setNewDoctor({ ...newDoctor, license_number: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input type="text" className="form-control" id="phone" placeholder="Enter phone number" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                            </div>
                            <button type="button" className="btn btn-primary" onClick={handleAddOrUpdateDoctor}>{isEditing ? 'Update Doctor' : 'Add Doctor'}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card">
                    <h4 className="card-header bg-secondary text-white">Doctor List</h4>
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Specialization</th>
                                    <th>License Number</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.first_name} {doctor.last_name}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.license_number}</td>
                                        <td>
                                            <button className="btn btn-info btn-sm" onClick={() => handleEditDoctor(doctor.id)}>Edit</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
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
    
    );
};

export default DoctorManagement;
