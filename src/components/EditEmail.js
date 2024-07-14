import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import TimezoneSelect from 'react-timezone-select';

const EditEmail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [frequency, setFrequency] = useState('');
  const [timezone, setTimezone] = useState({});
  const [interval, setInterval] = useState(1);

  useEffect(() => {
    let isMounted = true; // flag to track if the component is mounted

    fetch(`/api/history/${id}`)
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setEmail(data);
          setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.templateContent))));
          setScheduleDate(new Date(data.schedule).toISOString().split('T')[0]);
          setScheduleTime(new Date(data.schedule).toISOString().split('T')[1].slice(0, 5));
          setFrequency(data.frequency || '');
          setTimezone({ value: data.timezone });
          setInterval(data.interval || 1);
        }
      })
      .catch(error => console.error('Error fetching email:', error));

    return () => {
      isMounted = false; // cleanup function to set isMounted to false when the component unmounts
    };
  }, [id]);

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const scheduleDateTime = `${scheduleDate} ${scheduleTime}`;

    const updatedEmail = {
      ...email,
      schedule: scheduleDateTime,
      frequency,
      templateContent: updatedContent,
      timezone: timezone.value,
      interval,
    };

    try {
      const response = await fetch(`https://email-autom-backend-2.onrender.com/api/history/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmail),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update email: ${errorData.message}`);
      }

      alert('Email updated successfully');
      navigate('https://email-autom-backend-2.onrender.com');
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email. Please try again later.');
    }
  };

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Scheduled Email</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            value={email.clientId?.name || ''}
            disabled
          />
        </div>
        <div>
          <label>Client Email:</label>
          <input
            type="text"
            value={email.clientId?.email || ''}
            disabled
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={email.subject}
            onChange={(e) => setEmail({ ...email, subject: e.target.value })}
            required
          />
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
          <label>Frequency:</label>
          <input
            type="text"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="e.g., once, daily, weekly, monthly"
          />
        </div>
        <div>
          <label>Interval:</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            placeholder="Interval (e.g., 1, 2, 3)"
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
        <button type="submit">Update Email</button>
      </form>
    </div>
  );
};

export default EditEmail;
