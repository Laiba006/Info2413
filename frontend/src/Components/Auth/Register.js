import './Register.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [doctors_list, setDList] = useState([]);
  const [patientName, setPName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [dob, setDOB] = useState('');
  const [docID, setDocID] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/register');
        setDList(response.data);
      } catch (err) {
        setError('Request of the doctors failed.');
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if phone number is exactly 10 characters long
    if (phoneNumber.length !== 10) {
      setError('Phone number must be exactly 10 digits long.');
      return; // Prevent form submission
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const response = await axios.post('http://localhost:5000/register', {
        patientName,
        email,
        phoneNumber,
        dob,
        docID,
        password: hashedPassword
      });

      console.log('Registration successful:', response.data);
      if (response.data.confirm === "OK"){
        navigate('/');
      }if (response.data.confirm === "ERROR") {
        setError('Registration failed. Account on the same email already exist');
      } else {
        setError('Registration failed. Something went wrong');
      }
    } catch (err) {
      setError('Registration failed. Please check your input and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={patientName}
        onChange={(e) => setPName(e.target.value)}
        placeholder="name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="phone number"
        required
      />
      <input
        type="date"
        value={dob}
        onChange={(e) => setDOB(e.target.value)}
        placeholder="YYYY-MM-DD"
        required
      />
      <select onChange={(e) => setDocID(e.target.value)} required>
        <option value="">Select a Doctor</option>
        {Array.isArray(doctors_list) && doctors_list.map((doctor, index) => (
          <option key={index} value={doctor.id}>{doctor.email}</option>
        ))}
      </select>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        required
      />
      <button type="submit">submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if it exists */}
    </form>
  );
};

export default Register;
