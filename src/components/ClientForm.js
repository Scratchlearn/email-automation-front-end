import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';


const ClientForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clientDetails = {
      name,
      email,
    };

    try {
      const response = await fetch('https://email-autom-backend-2.onrender.com/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientDetails),
      });

      if (response.ok) {
        alert('Client added successfully');
        setName('');
        setEmail('');
        navigate('https://email-autom-backend-2.onrender.com');
      } else {
        alert('Failed to add client');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client');
    }
  };

  return (
    <div className="container">
      <h2>Add Client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
       
        <button type="submit">Add Client</button>
      </form>
    </div>
  );
};

export default ClientForm;
