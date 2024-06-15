import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin/Admin';
import Doctor from './components/Doctor/Doctor';
import Patient from './components/Patient/Patient';
import Receptionist from './components/Receptionist/Receptionist';
import UserManagement from './components/Admin/UserManagement';
import DoctorManagement from './components/Admin/DoctorManagement';
import PatientManagement from './components/Admin/PatientManagement';
import AppointmentManagement from './components/Admin/AppointmentManagement';
import MedicalRecordsManagement from './components/Admin/MedicalRecordsManagement';
import PatientManagementDoctor from './components/Doctor/PatientManagement';
import AppointmentManagementDoctor from './components/Doctor/AppointmentManagement';
import MedicalRecordsManagementDoctor from './components/Doctor/MedicalRecordsManagement';
import AppointmentManagementPatient from './components/Patient/AppointmentManagement';
import MedicalRecordsManagementPatient from './components/Patient/MedicalRecordsManagement';
import PatientManagementReceptionist from './components/Receptionist/PatientManagement';
import AppointmentManagementReceptionist from './components/Receptionist/AppointmentManagement';
import axios from 'axios';

const App = () => {
  const [usersList, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [medicalRecordsList, setMedicalRecordsList] = useState([]);

  const addUser = (user) => {
    const newUser = { ...user, id: usersList.length ? usersList[usersList.length - 1].id + 1 : 1 };
    setUsersList([...usersList, newUser]);
  };

  const loginUser = (user) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/users');
        setUsersList(usersResponse.data);

        const patientsResponse = await axios.get('/patients');
        setPatientsList(patientsResponse.data);

        const doctorsResponse = await axios.get('/doctors');
        setDoctorsList(doctorsResponse.data);

        const appointmentsResponse = await axios.get('/appointments');
        setAppointmentsList(appointmentsResponse.data);

        const medicalRecordsResponse = await axios.get('/medical_records');
        setMedicalRecordsList(medicalRecordsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login users={usersList} loginUser={loginUser} />} />
        <Route path="/admin/*" element={<Admin currentUser={currentUser} users={usersList} setUsers={setUsersList} />}>
          <Route path="users" element={<UserManagement users={usersList} setUsers={setUsersList} />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="records" element={<MedicalRecordsManagement />} />
        </Route>
        <Route path="/doctor/*" element={<Doctor currentUser={currentUser}/>}>
          <Route path="patients" element={<PatientManagementDoctor />} />
          <Route path="appointments" element={<AppointmentManagementDoctor currentUser={currentUser}/>} />
          <Route path="records" element={<MedicalRecordsManagementDoctor currentUser={currentUser}/>} />
        </Route>
        <Route path="/patient/*" element={<Patient currentUser={currentUser}/>}>
          <Route path="appointments" element={<AppointmentManagementPatient currentUser={currentUser}/>} />
          <Route path="records" element={<MedicalRecordsManagementPatient currentUser={currentUser}/>} />
        </Route>
        <Route path="/receptionist/*" element={<Receptionist currentUser={currentUser}/>}>
          <Route path="patients" element={<PatientManagementReceptionist />} />
          <Route path="appointments" element={<AppointmentManagementReceptionist doctors={doctorsList}/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
