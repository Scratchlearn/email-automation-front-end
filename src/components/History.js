import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';

const History = () => {
  const [scheduledEmails, setScheduledEmails] = useState([]);
  //const navigate = useNavigate();

  useEffect(() => {
    fetch('https://email-autom-backend-2.onrender.com/api/history')
      .then(response => response.json())
      .then(data => setScheduledEmails(data))
      .catch(error => console.error('Error fetching scheduled emails:', error));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://email-autom-backend-2.onrender.com/api/history/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      setScheduledEmails(scheduledEmails.filter(email => email._id !== id));
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };


  return (
    <div>
      <h1>Scheduled Emails History</h1>
      <ul>
        {scheduledEmails.map(email => (
          <li key={email._id}>
            <h2>{email.subject}</h2>
            <p>Client: {email.clientId.name}</p>
            <p>Scheduled Date: {new Date(email.schedule).toLocaleString()}</p>
            <p>Template Content: {email.templateContent}</p>
           
            <button onClick={() => handleDelete(email._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
