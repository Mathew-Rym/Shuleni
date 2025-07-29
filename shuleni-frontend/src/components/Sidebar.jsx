import React from 'react';
import { Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt,
  faUserTie,
  faUserGraduate,
  faBookOpen,
  faChalkboard,
  faClipboardCheck,
  faChartLine,
  faCreditCard,
  faCog,
  faChalkboardTeacher,
  faUsers,
  faGraduationCap,
  faClipboardList,
  faCalendarCheck,
  faAward,
  faTasks,
  faComments
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, onClose, onOpenSettings }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleNavigation = (path, action) => {
    if (action === 'settings') {
      onOpenSettings();
    } else {
      navigate(path);
    }
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { path: `/${user?.role}`, icon: faTachometerAlt, label: 'Dashboard' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { path: '/educators', icon: faUserTie, label: 'Educators' },
          { path: '/students', icon: faUserGraduate, label: 'Student Management', description: 'Comprehensive student information system' },
          { path: '/resources', icon: faBookOpen, label: 'Resources' },
          { path: '/classes', icon: faChalkboard, label: 'Classes' },
          { path: '/attendance', icon: faClipboardCheck, label: 'Attendance' },
          { path: '/reports', icon: faChartLine, label: 'Analytics Dashboard', description: 'Real-time insights and reports for data-driven decision making and performance monitoring.' },
          { path: '/fees', icon: faCreditCard, label: 'Fee Management', description: 'Complete fee collection system with payment tracking, receipts, and financial reporting.' },
          { action: 'settings', icon: faCog, label: 'Settings' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { path: '/teacher-portal', icon: faChalkboardTeacher, label: 'Teacher Portal', description: 'Dedicated teacher interface for grade management, attendance tracking, and curriculum planning.' },
          { path: '/my-classes', icon: faUsers, label: 'My Classes' },
          { path: '/students', icon: faUserGraduate, label: 'Students' },
          { path: '/resources', icon: faBookOpen, label: 'Resources' },
          { path: '/attendance', icon: faClipboardCheck, label: 'Attendance' },
          { path: '/grades', icon: faGraduationCap, label: 'Grades' },
          { path: '/exams', icon: faClipboardList, label: 'Exams' },
          { action: 'settings', icon: faCog, label: 'Settings' },
        ];
      case 'student':
        return [
          ...baseItems,
          { path: '/my-classes', icon: faUsers, label: 'My Classes' },
          { path: '/resources', icon: faBookOpen, label: 'Resources' },
          { path: '/attendance', icon: faCalendarCheck, label: 'My Attendance' },
          { path: '/grades', icon: faAward, label: 'My Grades' },
          { path: '/exams', icon: faTasks, label: 'Exams' },
          { path: '/chat', icon: faComments, label: 'Class Chat' },
          { action: 'settings', icon: faCog, label: 'Settings' },
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
            onClick={() => handleNavigation(item.path, item.action)}
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
            title={item.description || item.label}
          >
            <FontAwesomeIcon 
              icon={item.icon} 
              className="me-3" 
              style={{ fontSize: '1.2rem', width: '20px' }} 
            />
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      {/* Sidebar footer */}
      <div className="mt-auto p-3 border-top border-light border-opacity-25">
        <div className="text-white text-center small opacity-75">
          <div className="d-flex align-items-center justify-content-center mb-1">
            <img 
              src="/favicon.svg" 
              alt="Shuleni Logo" 
              width="16" 
              height="16" 
              className="me-2"
            />
            Shuleni School Management
          </div>
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