import React, { useState } from 'react';
import Sidebar from '../components/sidemenu/Sidemenu';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden p-6 transition-all duration-300 ${
          open ? 'ml-64' : 'ml-16'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
