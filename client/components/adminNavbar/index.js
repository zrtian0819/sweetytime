import React from 'react';
import Link from 'next/link';
import { Navbar, Nav, Dropdown, Form, FormControl } from 'react-bootstrap';
import styles from './admin-navbar.module.scss';

const AdminNavbar = () => {
  return (
    <Navbar expand="lg" className={`${styles.navbar} fixed-top d-flex`}>
      <Navbar.Brand className="mr-auto">
        <Link href="/">甜覓食光</Link>
      </Navbar.Brand>
      <div className={`${styles.navRight} d-flex`}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-flex align-items-center">
            <Form className="d-none d-lg-block mr-3">
              <FormControl
                type="text"
                placeholder="Search now"
                className="mr-sm-2"
                style={{
                  backgroundColor: '#f8f8f8',
                  color: '#333333',
                  borderRadius: '4px',
                }}
              />
            </Form>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-basic" className={styles.icon}>
                <i className="mdi mdi-bell-outline"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Notification 1</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Notification 2</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Notification 3</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="dropdown-basic" className={styles.icon}>
                <i className="mdi mdi-account-circle-outline"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link href="/profile" legacyBehavior>
                    <a>Profile</a>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link href="/settings" legacyBehavior>
                    <a>Settings</a>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link href="/logout" legacyBehavior>
                    <a>Logout</a>
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AdminNavbar;
