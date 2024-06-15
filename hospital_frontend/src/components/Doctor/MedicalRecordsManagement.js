import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicalRecordManagement = ({ currentUser }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    visit_date: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });
  const [newFormData, setNewFormData] = useState({
    patient_id: '', // Adding patient_id for new record
    doctor_id: doctorId, 
    visit_date: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });
  const [patients, setPatients] = useState([]); // State to store patients for select dropdown

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      if (doctorId) {
        const response = await axios.get(`http://127.0.0.1:8000/api/medical_recordsDoctor/${doctorId}`);
        const medicalRecordsData = response.data;

        const patientIds = [...new Set(medicalRecordsData.map(record => record.patient_id))];

        const patientsResponse = await Promise.all(patientIds.map(patientId =>
          axios.get(`http://127.0.0.1:8000/api/patients/${patientId}`)
        ));

        const patientsData = patientsResponse.reduce((acc, response) => {
          const patient = response.data;
          acc[patient.id] = { first_name: patient.first_name, last_name: patient.last_name };
          return acc;
        }, {});

        const combinedData = medicalRecordsData.map(record => ({
          ...record,
          patient_firstname: patientsData[record.patient_id]?.first_name || '',
          patient_lastname: patientsData[record.patient_id]?.last_name || ''
        }));

        setMedicalRecords(combinedData);
      }
    } catch (error) {
      console.error('Error fetching medical records or patient data:', error);
    }
  };

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/doctorsEmail/${currentUser.email}`);
        const doctorData = response.data;
        setDoctorId(doctorData.id);
      } catch (error) {
        console.error('Error fetching doctor ID:', error);
      }
    };

    if (currentUser) {
      fetchDoctorId();
    }
  }, [currentUser]);

  useEffect(() => {
    if (doctorId) {
      fetchMedicalRecords();
    }
  }, [doctorId]);

  const handleEdit = (recordId) => {
    setEditRecordId(recordId);
    const recordToEdit = medicalRecords.find(record => record.id === recordId);
    setEditFormData({
      visit_date: recordToEdit.visit_date,
      diagnosis: recordToEdit.diagnosis,
      treatment: recordToEdit.treatment,
      notes: recordToEdit.notes,
      // Populate other fields as needed
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/medicalRecords/${id}`, editFormData);
      fetchMedicalRecords(); // Refresh list after edit
      setEditRecordId(null);
    } catch (error) {
      console.error('Error updating medical record:', error);
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNew = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/doctorsEmail/${currentUser.email}`);
      const doctorData = response.data;
      const fetchedDoctorId = doctorData.id;
      
      // Set doctorId state here
      setDoctorId(fetchedDoctorId);
  
      // Now create newFormData object with updated doctor_id
      const updatedFormData = {
        ...newFormData,
        doctor_id: fetchedDoctorId, // Set the correct doctor_id
      };
  
      // Send POST request with updatedFormData
      const newRecordResponse = await axios.post('http://127.0.0.1:8000/api/addMedicalRecords', updatedFormData);
      const newRecord = newRecordResponse.data;
  
      // Update state after successful creation
      setMedicalRecords([...medicalRecords, newRecord]);
      setNewFormData({
        patient_id: '',
        doctor_id: fetchedDoctorId, // Set doctor_id again to ensure consistency
        visit_date: '',
        diagnosis: '',
        treatment: '',
        notes: '',
      });
      fetchMedicalRecords();
    } catch (error) {
      console.error('Error adding new medical record:', error);
    }
  };  

  const handleNewFormChange = (e) => {
    setNewFormData({
      ...newFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
<div className="container-fluid mt-5">
  <h2 className="text-center mb-4">Medical Records</h2>
  <div className="row">
    <div className="col-lg-4 mb-3">
        <div className="card p-4">
          <h3 className="card-title">New Record</h3>
          <div className="form-group">
            <label>Patient:</label>
            <select
              className="form-control"
              name="patient_id"
              value={newFormData.patient_id}
              onChange={handleNewFormChange}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {`${patient.first_name} ${patient.last_name}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Visit Date:</label>
            <input
              type="date"
              className="form-control"
              name="visit_date"
              value={newFormData.visit_date}
              onChange={handleNewFormChange}
            />
          </div>
          <div className="form-group">
            <label>Diagnosis:</label>
            <input
              type="text"
              className="form-control"
              name="diagnosis"
              value={newFormData.diagnosis}
              onChange={handleNewFormChange}
            />
          </div>
          <div className="form-group">
            <label>Treatment:</label>
            <input
              type="text"
              className="form-control"
              name="treatment"
              value={newFormData.treatment}
              onChange={handleNewFormChange}
            />
          </div>
          <div className="form-group">
            <label>Notes:</label>
            <input
              type="text"
              className="form-control"
              name="notes"
              value={newFormData.notes}
              onChange={handleNewFormChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary mr-2" onClick={handleAddNew}>
              Save
            </button>
          </div>
        </div>
    </div>
    <div className="col-lg-8">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Visit Date</th>
            <th>Patient First Name</th>
            <th>Patient Last Name</th>
            <th>Diagnosis</th>
            <th>Treatment</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicalRecords.map((record) => (
            <tr key={record.id}>
              <td>
                {editRecordId === record.id ? (
                  <input
                    type="date"
                    className="form-control"
                    name="visit_date"
                    value={editFormData.visit_date}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  record.visit_date
                )}
              </td>
              <td>{record.patient_firstname}</td>
              <td>{record.patient_lastname}</td>
              <td>
                {editRecordId === record.id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="diagnosis"
                    value={editFormData.diagnosis}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  record.diagnosis
                )}
              </td>
              <td>
                {editRecordId === record.id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="treatment"
                    value={editFormData.treatment}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  record.treatment
                )}
              </td>
              <td>
                {editRecordId === record.id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="notes"
                    value={editFormData.notes}
                    onChange={handleEditFormChange}
                  />
                ) : (
                  record.notes
                )}
              </td>
              <td>
                {editRecordId === record.id ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSaveEdit(record.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => handleEdit(record.id)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  
  );
};

export default MedicalRecordManagement;
