import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScheduleManager from './components/ScheduleManager';
import ClientForm from './components/ClientForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import SMTPSettings from './components/SmtpSettings';
import AddTemplate from './components/AddTemplate';
import NotFound from './components/NotFound';
import History from './components/History';
import EditEmail from './components/EditEmail';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Email Management App</h1>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/api/clients" element={<ClientForm />} />
            <Route path="/" element={<ScheduleManager />} />
            <Route path="/api/smtp-settings" element={<SMTPSettings />} />
            <Route path="/api/templates" element={<AddTemplate />} />
            <Route path="/api/history" element={<History />} />
            <Route path="/api/history/:id" element={<EditEmail/>} />
             <Route path="*" element={NotFound} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
