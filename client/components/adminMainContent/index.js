// components/AdminMainContent.js
import React from 'react';
// import styles from '@/styles/admin.module.scss';

const adminMainContent = () => {
  return (
    <div className="container-fluid mt-5 pt-4">
      <div className="row">
        <div className="col-12">
          <div className="my-4">
            <h2>Welcome, John</h2>
            <p>
              All systems are running smoothly! You have{' '}
              <span className="text-primary" style={{ cursor: 'pointer' }}>3 unread alerts!</span>
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="bg-primary text-white p-3 rounded">
            <p>Today's Bookings: 4006</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="bg-info text-white p-3 rounded">
            <p>Total Bookings: 61344</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="bg-success text-white p-3 rounded">
            <p>Number of Meetings: 34040</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-4">
          <div className="bg-danger text-white p-3 rounded">
            <p>Number of Clients: 47033</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminMainContent;
