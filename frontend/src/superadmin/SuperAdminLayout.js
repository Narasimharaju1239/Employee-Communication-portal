import React from 'react';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

const SuperAdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, background: '#f8fafc', minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdminLayout;
