import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  ChevronDown,
  LogOut,
  User2,
  FolderOpenDotIcon,
  ListCheckIcon,
  HistoryIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/auth/authSlice';

const Sidemenu = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { userType } = useSelector((state) => state.auth);

  const menuItems = [
    {
      icon: <Home size={20} />,
      label: 'Dashboard',
      path: '/',
      roles: ['admin', 'developer', 'tester'],
    },
    {
      icon: <User2 size={20} />,
      label: 'User',
      path: '/user',
      roles: ['admin'],
    },
    {
      icon: <FolderOpenDotIcon size={20} />,
      label: 'Project',
      path: '/project',
      roles: ['admin'],
    },
    {
      icon: <ListCheckIcon size={20} />,
      label: 'Task',
      roles: ['admin', 'developer'],
      submenu: [
        { label: 'Create', path: '/task/create' },
        { label: 'To-Do', path: '/task/todo' },
        { label: 'In Progress', path: '/task/in-progress' },
        // { label: 'Reject', path: '/task/reject' },
        { label: 'Done', path: '/task/done' },
      ],
    },
    {
      icon: <FolderOpenDotIcon size={20} />,
      label: 'Report',
      roles: ['admin'],
      submenu: [{ label: 'Project Report', path: '/report/project' }],
    },
    {
      icon: <HistoryIcon size={20} />,
      label: 'Activity Log',
      path: '/activity-log',
      roles: ['admin', 'developer'],
    },
  ];

  const toggleSubmenu = (label) => {
    setActiveSubmenu((prev) => (prev === label ? null : label));
  };

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem('authentication');
    navigate('/login');
  };

  const isAuthorized = (roles) => {
    if (!userType) return false;
    return roles.includes(userType);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-purple-600 to-indigo-600 text-white 
      transition-all duration-300 ease-in-out z-30 flex flex-col justify-between p-3 
      ${open ? 'w-64' : 'w-16'}`}
    >
      {/* Top section */}
      <div>
        {/* Toggle Sidebar Button */}
        <div className="flex justify-end mb-5 mt-2">
          <button
            onClick={() => setOpen(!open)}
            className="text-white focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} className="mr-[10px]" />}
          </button>
        </div>

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems
            .filter((item) => isAuthorized(item.roles))
            .map((item, index) => (
              <li key={index}>
                <div
                  onClick={() =>
                    item.submenu
                      ? toggleSubmenu(item.label)
                      : navigate(item.path)
                  }
                  className="flex items-center justify-between gap-4 hover:bg-white hover:text-indigo-600 rounded-lg p-2 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span
                      className={`text-sm font-medium transition-opacity duration-200 ${
                        open ? 'opacity-100' : 'opacity-0 hidden'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.submenu && open && (
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform duration-200 ${
                        activeSubmenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.label && open && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((sub, subIndex) => (
                      <li
                        onClick={() => navigate(sub.path)}
                        key={subIndex}
                        className="text-sm hover:bg-white hover:text-indigo-600 rounded-md px-2 py-1 cursor-pointer transition-colors"
                      >
                        {sub.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </div>

      {/* Logout */}
      <div className="mt-6 border-t border-white/20 pt-4">
        <div
          onClick={handleLogout}
          className="flex items-center gap-4 hover:bg-white hover:text-indigo-600 rounded-lg p-2 cursor-pointer transition-colors"
        >
          <LogOut size={20} />
          <span
            className={`text-sm font-medium transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0 hidden'
            }`}
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
