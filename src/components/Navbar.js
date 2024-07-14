import React from 'react';
import { Link } from 'react-router-dom';
import './styles2.css'
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Your Logo/Brand</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/api/clients">Add Client</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/api/templates">Add Email Template</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/api/smtp-settings">SMTP Settings</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/api/history">Email History</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
