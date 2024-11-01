import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ElementList from '@/components/ElementList';

const Index = () => {
  return (
    <AdminLayout>
      <div className="d-flex flex-wrap">
        <h2>Hello Team Sweety Time : D</h2>
      <ElementList />
      </div>
    </AdminLayout>
  );
};

export default Index;
