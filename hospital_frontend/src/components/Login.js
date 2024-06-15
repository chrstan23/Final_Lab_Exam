import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ loginUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Invalid email or password');
        }
      })
      .then(data => {
        localStorage.setItem('user', JSON.stringify(data.user));
        loginUser(data.user);
        navigate(`/${data.user.role}`);
      })
      .catch(error => {
        alert(error.message);
      });
  };

  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card border-primary shadow">
          <div className="card-body">
            <h2 className="card-title text-center mb-4 text-primary">Login</h2>
            <form>
              <div className="form-group">
                <label htmlFor="email" className="text-primary">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="text-primary">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="btn btn-primary btn-block" onClick={handleLogin}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default Login;
