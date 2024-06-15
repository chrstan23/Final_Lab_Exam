import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalRecordsManagement = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

    const fetchMedicalRecords = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/medical_records');
            const recordsWithDetails = await Promise.all(
                response.data.map(async record => {
                    // Fetch patient and doctor details
                    const [patient, doctor] = await Promise.all([
                        fetchPersonDetails('patients', record.patient_id),
                        fetchPersonDetails('doctors', record.doctor_id)
                    ]);

                    return {
                        ...record,
                        patient: patient,
                        doctor: doctor
                    };
                })
            );
            setMedicalRecords(recordsWithDetails);
        } catch (error) {
            console.error('Failed to fetch medical records:', error);
        }
    };

    const fetchPersonDetails = async (type, id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/${type}/${id}`);
            return `${response.data.first_name} ${response.data.last_name}`;
        } catch (error) {
            console.error(`Failed to fetch ${type} details with id ${id}:`, error);
            return 'Unknown'; // or handle error state appropriately
        }
    };

    return (
        <div className="container">
        <h3 className="my-4">Medical Records Management</h3>
        <div className="card">
            <div className="card-header bg-dark text-white">
                <h4 className="mb-0">All Medical Records</h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Visit Date</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Notes</th>
                                <th>Actions</th> {/* Add action column header */}
                            </tr>
                        </thead>
                        <tbody>
                            {medicalRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.visit_date}</td>
                                    <td>{record.patient}</td>
                                    <td>{record.doctor}</td>
                                    <td>{record.diagnosis}</td>
                                    <td>{record.treatment}</td>
                                    <td>{record.notes}</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn btn-info btn-sm me-1">Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
     
    );
};

export default MedicalRecordsManagement;
