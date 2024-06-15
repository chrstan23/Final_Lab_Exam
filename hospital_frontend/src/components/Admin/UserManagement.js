import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
    const { users, setUsers } = useOutletContext();
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'patient' });
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        setUsers([]);
        fetchUsers();
    }, [setUsers]);

    const handleAddOrUpdateUser = async () => {
        const userData = {
            ...newUser,
            name: `${firstName} ${lastName}`,
        };

        if (isEditing) {
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/users/${editingUser.id}`, userData);
                const updatedUser = response.data;
                setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
                resetForm();
                
                const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
                const addedUser = response.data;

                if (newUser.role === 'patient') {
                    await registerPatient();
                } else if (newUser.role === 'doctor') {
                    await registerDoctor();
                } else {
                    setUsers([...users, addedUser]);
                    resetForm();
                }

                const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
    };

    const registerPatient = async () => {
        const patientData = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            gender,
            address,
            phone,
            email: newUser.email,
            emergency_contact: emergencyContact,
            medical_history: medicalHistory,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/addPatients', patientData);
            const data = response.data;
            if (data.errors) {
                alert('Error registering patient: ' + JSON.stringify(data.errors));
            } else {
                resetForm();
            }
        } catch (error) {
            console.error('Error registering patient:', error);
        }
    };

    const registerDoctor = async () => {
        const doctorData = {
            first_name: firstName,
            last_name: lastName,
            specialization,
            license_number: licenseNumber,
            phone,
            email: newUser.email,
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/addDoctors', doctorData);
            const data = response.data;
            if (data.errors) {
                alert('Error registering doctor: ' + JSON.stringify(data.errors));
            } else {
                resetForm();
            }
        } catch (error) {
            console.error('Error registering doctor:', error);
        }
    };

    const handleEditUser = async (id) => {
        const userToEdit = users.find(user => user.id === id);
        setEditingUser(userToEdit);
        setIsEditing(true);
        setNewUser({ email: userToEdit.email, role: userToEdit.role });
        const [firstName, lastName] = userToEdit.name.split(' ');
        setFirstName(firstName);
        setLastName(lastName);
    };
    
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeUser/${id}`);
            setUsers(users.filter(user => user.id !== id));
            const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
            setUsers(usersResponse.data);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setIsEditing(false);
        setNewUser({ email: '', password: '', role: 'patient' });
        setFirstName('');
        setLastName('');
        setDateOfBirth('');
        setGender('');
        setAddress('');
        setPhone('');
        setEmergencyContact('');
        setMedicalHistory('');
        setSpecialization('');
        setLicenseNumber('');
    };

    return (
<div className="container-fluid mt-5">
    <h3 className="mb-4">User Management</h3>
    <div className="row">
        <div className="col-lg-4">
            <div className="card">
                <div className="card-header">
                    <h4>{isEditing ? 'Edit User' : 'Add New User'}</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select id="role" className="form-select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input type="text" id="firstName" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input type="text" id="lastName" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    {!isEditing && newUser.role === 'patient' && (
                        <>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                    <input type="date" id="dateOfBirth" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                                </div>
                                <div className="col">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <input type="text" id="gender" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" id="address" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input type="text" id="phone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="col">
                                    <label htmlFor="emergencyContact" className="form-label">Emergency Contact</label>
                                    <input type="text" id="emergencyContact" className="form-control" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="medicalHistory" className="form-label">Medical History</label>
                                <textarea id="medicalHistory" className="form-control" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)}></textarea>
                            </div>
                        </>
                    )}
                    {!isEditing && newUser.role === 'doctor' && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="specialization" className="form-label">Specialization</label>
                                <input type="text" id="specialization" className="form-control" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="licenseNumber" className="form-label">License Number</label>
                                    <input type="text" id="licenseNumber" className="form-control" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                                </div>
                                <div className="col">
                                    <label htmlFor="doctorPhone" className="form-label">Phone</label>
                                    <input type="text" id="doctorPhone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" id="email" className="form-control" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                    </div>
                    {!isEditing && (
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" id="password" className="form-control" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={handleAddOrUpdateUser}>{isEditing ? 'Update User' : 'Add User'}</button>
                </div>
            </div>
        </div>
        <div className="col-lg-8">
            <div className="card">
                <div className="card-header">
                    <h4>User List</h4>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleEditUser(user.id)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
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

export default UserManagement;
