import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { path: `/${user?.role}`, icon: '📊', label: 'Dashboard' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { path: '/educators', icon: '👨‍🏫', label: 'Educators' },
          { path: '/students', icon: '👥', label: 'Students' },
          { path: '/resources', icon: '📚', label: 'Resources' },
          { path: '/classes', icon: '🏛️', label: 'Classes' },
          { path: '/attendance', icon: '✅', label: 'Attendance' },
          { path: '/reports', icon: '📈', label: 'Reports' },
          { path: '/settings', icon: '⚙️', label: 'Settings' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { path: '/my-classes', icon: '🏛️', label: 'My Classes' },
          { path: '/students', icon: '👥', label: 'Students' },
          { path: '/resources', icon: '📚', label: 'Resources' },
          { path: '/attendance', icon: '✅', label: 'Attendance' },
          { path: '/grades', icon: '📝', label: 'Grades' },
          { path: '/exams', icon: '📋', label: 'Exams' },
        ];
      case 'student':
        return [
          ...baseItems,
          { path: '/my-classes', icon: '🏛️', label: 'My Classes' },
          { path: '/resources', icon: '📚', label: 'Resources' },
          { path: '/attendance', icon: '✅', label: 'My Attendance' },
          { path: '/grades', icon: '📝', label: 'My Grades' },
          { path: '/exams', icon: '📋', label: 'Exams' },
          { path: '/chat', icon: '💬', label: 'Class Chat' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`shuleni-sidebar ${isOpen ? 'show' : ''}`}>
      {/* Sidebar header */}
      <div className="p-3 border-bottom border-light border-opacity-25">
        <div className="d-flex align-items-center">
          <img
            src={user?.avatar || 'https://via.placeholder.com/50/FFFFFF/4A90E2?text=U'}
            alt="Profile"
            className="rounded-circle me-3"
            width="50"
            height="50"
          />
          <div className="text-white">
            <div className="fw-bold">{user?.name || 'User'}</div>
            <div className="small opacity-75 text-capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <Nav className="flex-column p-3">
        {navigationItems.map((item, index) => (
          <Nav.Link
            key={index}
            href="#"
            className={`text-white d-flex align-items-center p-3 mb-2 rounded ${
              location.pathname === item.path ? 'bg-light bg-opacity-25' : ''
            }`}
            style={{
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === item.path ? 
                'rgba(255,255,255,0.2)' : 'transparent',
            }}
            onClick={() => handleNavigation(item.path)}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span className="me-3" style={{ fontSize: '1.2rem' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      {/* Sidebar footer */}
      <div className="mt-auto p-3 border-top border-light border-opacity-25">
        <div className="text-white text-center small opacity-75">
          <div>Shuleni School Management</div>
          <div>© 2025 All Rights Reserved</div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 999 
          }}
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default Sidebar;