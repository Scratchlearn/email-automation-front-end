import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';



const SMTPSettings = ({ onSave }) => {
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSMTPSettings = async () => {
      try {
        const response = await fetch('https://email-autom-backend-2.onrender.com/api/smtp-settings');
        const data = await response.json();
        if (data) {
          setSmtpHost(data.host);
          setSmtpPort(data.port);
          setSmtpUser(data.user);
          setSmtpPass(data.pass);
        }
      } catch (error) {
        console.error('Error fetching SMTP settings:', error);
      }
    };

    fetchSMTPSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const settings = { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass };

    try {
      const response = await fetch('https://email-autom-backend-2.onrender.com/api/smtp-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('SMTP settings saved successfully');
        navigate('https://email-autom-backend-2.onrender.com'); 
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to save SMTP settings: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      alert('Failed to save SMTP settings. Please try again later.');
    }

    onSave(settings);
  };

  return (
    <div className="smtp-container">
      <div className="header">
        <h2>SMTP Settings</h2>
      </div>
      <form onSubmit={handleSave}>
        <div>
          <label>SMTP Host:</label>
          <input
            type="text"
            value={smtpHost}
            onChange={(e) => setSmtpHost(e.target.value)}
            required
          />
        </div>
        <div>
          <label>SMTP Port:</label>
          <input
            type="number"
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
            required
          />
        </div>
        <div>
          <label>SMTP User:</label>
          <input
            type="text"
            value={smtpUser}
            onChange={(e) => setSmtpUser(e.target.value)}
            required
          />
        </div>
        <div>
          <label>SMTP Password:</label>
          <input
            type="password"
            value={smtpPass}
            onChange={(e) => setSmtpPass(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default SMTPSettings;
