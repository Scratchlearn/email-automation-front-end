import React, { useState, useEffect } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.css';
import Navbar from './Navbar';
import TimezoneSelect from 'react-timezone-select';

const ScheduleManager = () => {
  const [clients, setClients] = useState(() => {
    const storedClients = localStorage.getItem('clients');
    return storedClients ? JSON.parse(storedClients) : [];
  });

  const [templates, setTemplates] = useState(() => {
    const storedTemplates = localStorage.getItem('templates');
    return storedTemplates ? JSON.parse(storedTemplates) : [];
  });

  const [clientId, setClientId] = useState('');
  const [subject, setSubject] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [timezone, setTimezone] = useState({}); // State to manage timezone selection
  const [frequency, setFrequency] = useState('once'); // State to manage frequency
  const [interval, setInterval] = useState(1); // State to manage interval

  const [placeholders, setPlaceholders] = useState({});
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await fetch('https://email-autom-backend-2.onrender.com/api/clients');
        const clientData = await clientResponse.json();
        setClients(clientData);
        localStorage.setItem('clients', JSON.stringify(clientData));

        const templateResponse = await fetch('https://email-autom-backend-2.onrender.com/api/templates');
        const templateData = await templateResponse.json();
        setTemplates(templateData);
        localStorage.setItem('templates', JSON.stringify(templateData));
      } catch (error) {
        console.error('Error fetching clients or templates:', error);
      }
    };

    fetchData();
  }, []);

  const handlePlaceholderChange = (key, value) => {
    setPlaceholders({ ...placeholders, [key]: value });
  };

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleTemplateChange = (e) => {
    const selectedTemplateId = e.target.value;
    setTemplateId(selectedTemplateId);

    const selectedTemplate = templates.find(
      (template) => template._id === selectedTemplateId
    );
    if (selectedTemplate) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(selectedTemplate.body)
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const templateContent = JSON.stringify(
      editorState.getCurrentContent().getPlainText()
    );

    const scheduleDateTime = `${scheduleDate} ${scheduleTime}`;

    const scheduleDetails = {
      clientId,
      subject,
      templateId,
      schedule: scheduleDateTime,
      timezone: timezone.value, // Include timezone in the schedule details
      placeholders,
      templateContent,
      frequency, // Include frequency in the schedule details
      interval, // Include interval in the schedule details
    };

    try {
      const response = await fetch('https://email-autom-backend-2.onrender.com/api/schedule-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to schedule email: ${errorData.message}`);
      }

      alert('Email scheduled successfully');
      setClientId('');
      setSubject('');
      setTemplateId('');
      setScheduleDate('');
      setScheduleTime('');
      setTimezone({});
      setFrequency('once');
      setInterval(1);
      setPlaceholders({});
      setEditorState(EditorState.createEmpty());
    } catch (error) {
      console.error('Error scheduling email:', error);
      alert('Failed to schedule email. Please try again later.');
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="header">
        <h2>Schedule Email</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client:</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Template:</label>
          <select value={templateId} onChange={handleTemplateChange} required>
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Schedule Date:</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Schedule Time:</label>
          <input
            type="time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Timezone:</label>
          <TimezoneSelect
            value={timezone}
            onChange={setTimezone}
          />
        </div>
        <div>
          <label>Frequency:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        {frequency !== 'once' && (
          <div>
            <label>Interval:</label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              min="1"
              required
            />
          </div>
        )}
        <div>
          <label>Template Content:</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="editor-wrapper"
            editorClassName="editor"
            toolbarClassName="toolbar"
            placeholder="Write your email template here..."
            required
          />
        </div>
        {Object.keys(placeholders).map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="text"
              value={placeholders[key]}
              onChange={(e) => handlePlaceholderChange(key, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Schedule Email</button>
      </form>
    </div>
  );
};

export default ScheduleManager;
