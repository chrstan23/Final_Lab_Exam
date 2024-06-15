import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Receptionist = ({ currentUser, users, setUsers }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout action here (e.g., clear session, reset authentication state)
        navigate('/');
    };

    React.useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    React.useEffect(() => {
        if (currentUser) {
            navigate('patients');
        }
    }, []);

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
                <div className="container-fluid">
                    <h2 className="navbar-brand">Receptionist</h2>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="patients" className="nav-link">
                                    Patients
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="appointments" className="nav-link">
                                    Appointments
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container-fluid content mt-4">
                <Outlet context={{ users, setUsers }} />
            </div>
        </div>
    );
};

export default Receptionist;
