import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';





const AddTemplate = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const templateContent = JSON.stringify(
      editorState.getCurrentContent().getPlainText()
    );

    try {
      const response = await fetch('https://email-autom-backend-2.onrender.com/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, subject, body: templateContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to add template');
      }

      alert('Template added successfully');
      navigate('https://email-autom-backend-2.onrender.com'); // Navigate to home page or template list page
    } catch (error) {
      console.error('Error adding template:', error);
      alert('Failed to add template. Please try again later.');
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  return (
    <div className="container">
      <h2>Add Email Template</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Template Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Template Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Template Body:</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="editor-wrapper"
            editorClassName="editor-content"
            toolbarClassName="editor-toolbar"
            toolbar={{
              options: [
                'inline',
                'blockType',
                'fontSize',
                'fontFamily',
                'list',
                'textAlign',
                'link',
                'image',
                'remove',
              ],
              inline: {
                options: ['bold', 'italic', 'underline', 'strikethrough'],
              },
              blockType: {
                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'Blockquote'],
              },
              textAlign: {
                options: ['left', 'center', 'right', 'justify'],
              },
              fontFamily: {
                options: [
                  'Arial',
                  'Georgia',
                  'Impact',
                  'Tahoma',
                  'Times New Roman',
                  'Verdana',
                ],
              },
            }}
          />
        </div>
        <button type="submit">Add Template</button>
      </form>
    </div>
  );
};

export default AddTemplate;
