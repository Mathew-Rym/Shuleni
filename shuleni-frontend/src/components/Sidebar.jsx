import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, faChalkboardTeacher, faUsers, faBook, 
  faSchool, faCheckSquare, faFileAlt, faCog, faGraduationCap,
  faPen, faClipboardList, faComments, faUserCircle
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 992) {
      onClose();
    }
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { path: `/${user?.role}`, icon: faChartBar, label: 'Dashboard' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { path: '/teachers', icon: faChalkboardTeacher, label: 'Teachers' },
          { path: '/students', icon: faUsers, label: 'Students' },
          { path: '/resources', icon: faBook, label: 'Resources' },
          { path: '/classes', icon: faSchool, label: 'Classes' },
          { path: '/attendance', icon: faCheckSquare, label: 'Attendance' },
          { path: '/reports', icon: faFileAlt, label: 'Reports' },
          { path: '/settings', icon: faCog, label: 'Settings' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { path: '/my-classes', icon: faSchool, label: 'My Classes' },
          { path: '/students', icon: faUsers, label: 'Students' },
          { path: '/resources', icon: faBook, label: 'Resources' },
          { path: '/attendance', icon: faCheckSquare, label: 'Attendance' },
          { path: '/grades', icon: faPen, label: 'Grades' },
          { path: '/exams', icon: faClipboardList, label: 'Exams' },
        ];
      case 'student':
        return [
          ...baseItems,
          { path: '/my-classes', icon: faSchool, label: 'My Classes' },
          { path: '/resources', icon: faBook, label: 'Resources' },
          { path: '/attendance', icon: faCheckSquare, label: 'My Attendance' },
          { path: '/grades', icon: faPen, label: 'My Grades' },
          { path: '/exams', icon: faClipboardList, label: 'Exams' },
          { path: '/chat', icon: faComments, label: 'Class Chat' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 1040
          }}
          onClick={onClose}
        />
      )}
      
      <div className={`shuleni-sidebar ${isOpen ? 'show' : ''}`}>
        {/* Sidebar header */}
        <div className="p-3 border-bottom border-light border-opacity-25">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={user?.avatar || 'https://via.placeholder.com/50/FFFFFF/4A90E2?text=U'}
                alt="Profile"
                className="rounded-circle me-3"
                width="40"
                height="40"
              />
              <div className="text-white d-none d-md-block">
                <div className="fw-bold">{user?.name || 'User'}</div>
                <div className="small opacity-75 text-capitalize">{user?.role}</div>
              </div>
            </div>
            <button 
              className="btn btn-link text-white p-0 d-lg-none"
              onClick={onClose}
              style={{ fontSize: '1.2rem' }}
            >
              <i className="fas fa-times"></i>
            </button>
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
            <span className="me-3" style={{ width: '24px', textAlign: 'center' }}>
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      {/* User profile links */}
      <div className="mt-auto">
        <div className="border-top border-light border-opacity-25 pt-2 mt-2">
          <Nav.Link
            className={`px-3 py-2 d-flex align-items-center ${location.pathname === '/profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('/profile')}
          >
            <FontAwesomeIcon icon={faUserCircle} className="me-2" />
            <span>My Profile</span>
          </Nav.Link>
          
          <Nav.Link
            className={`px-3 py-2 d-flex align-items-center ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('/settings')}
          >
            <FontAwesomeIcon icon={faCog} className="me-2" />
            <span>Account Settings</span>
          </Nav.Link>
        </div>
      </div>

      {/* Sidebar footer */}
      <div className="p-3 border-top border-light border-opacity-25">
        <div className="text-white text-center small opacity-75">
          <div>Shuleni School Management</div>
          <div>© 2025 All Rights Reserved</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;