// Main navigation bar component for Shuleni platform
import React, { useState } from 'react';
import { Navbar as BNavbar, Nav, Container, Dropdown, Button, Form, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { logoutUser } from '../Store/slices/authSlice';

// Mock data for search functionality
const mockData = {
  students: [
    { id: 1, name: 'John Doe', email: 'john@student.com', class: 'Grade 10A' },
    { id: 2, name: 'Jane Smith', email: 'jane@student.com', class: 'Grade 9B' }
  ],
  teachers: [
    { id: 1, name: 'Mr. Johnson', email: 'johnson@teacher.com', subject: 'Mathematics' },
    { id: 2, name: 'Ms. Williams', email: 'williams@teacher.com', subject: 'English' }
  ],
  classes: [
    { id: 1, name: 'Grade 10A', subject: 'Mathematics', teacher: 'Mr. Johnson' },
    { id: 2, name: 'Grade 9B', subject: 'English', teacher: 'Ms. Williams' }
  ],
  resources: [
    { id: 1, title: 'Math Textbook', type: 'PDF', subject: 'Mathematics' },
    { id: 2, title: 'English Grammar', type: 'Video', subject: 'English' }
  ],
  exams: [
    { id: 1, title: 'Math Midterm', subject: 'Mathematics', date: '2024-03-15' },
    { id: 2, title: 'English Quiz', subject: 'English', date: '2024-03-20' }
  ]
};

const Navbar = ({ toggleSidebar, showSidebarToggle = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Get user role safely
  const userRole = user?.role || 'guest';
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Role-based search permissions
  const getSearchPermissions = () => {
    switch (userRole) {
      case 'admin':
        return {
          canSearchStudents: true,
          canSearchTeachers: true,
          canSearchClasses: true,
          canSearchResources: true,
          canSearchExams: true,
          searchPlaceholder: 'Search students, teachers, classes, resources...'
        };
      case 'teacher':
        return {
          canSearchStudents: true,
          canSearchTeachers: false,
          canSearchClasses: true,
          canSearchResources: true,
          canSearchExams: false,
          searchPlaceholder: 'Search students, classes, resources...'
        };
      case 'student':
        return {
          canSearchStudents: false,
          canSearchTeachers: false,
          canSearchClasses: true,
          canSearchResources: true,
          canSearchExams: false,
          searchPlaceholder: 'Search classes, resources...'
        };
      default:
        return {
          canSearchStudents: false,
          canSearchTeachers: false,
          canSearchClasses: false,
          canSearchResources: false,
          canSearchExams: false,
          searchPlaceholder: 'Search not available'
        };
    }
  };

  const permissions = getSearchPermissions();

  // Handle search functionality with role-based filtering
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = {};
      
      // Filter based on role permissions
      if (permissions.canSearchStudents) {
        results.students = mockData.students.filter(student =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.class.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (permissions.canSearchTeachers) {
        results.teachers = mockData.teachers.filter(teacher =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (permissions.canSearchClasses) {
        results.classes = mockData.classes.filter(cls =>
          cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (permissions.canSearchResources) {
        results.resources = mockData.resources.filter(resource =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (permissions.canSearchExams) {
        results.exams = mockData.exams.filter(exam =>
          exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.class.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // Handle search input change and perform search
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    // Perform real-time search based on role permissions
    const results = [];
    
    // Filter based on role permissions
    if (permissions.canSearchStudents) {
      const students = mockData.students.filter(student =>
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase()) ||
        student.class.toLowerCase().includes(query.toLowerCase())
      ).map(student => ({
        ...student,
        type: 'student',
        title: student.name,
        subtitle: `${student.class} • ${student.email}`
      }));
      results.push(...students);
    }
    
    if (permissions.canSearchTeachers) {
      const teachers = mockData.teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.email.toLowerCase().includes(query.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(query.toLowerCase())
      ).map(teacher => ({
        ...teacher,
        type: 'teacher',
        title: teacher.name,
        subtitle: `${teacher.subject} • ${teacher.email}`
      }));
      results.push(...teachers);
    }
    
    if (permissions.canSearchClasses) {
      const classes = mockData.classes.filter(cls =>
        cls.name.toLowerCase().includes(query.toLowerCase()) ||
        cls.subject.toLowerCase().includes(query.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(query.toLowerCase())
      ).map(cls => ({
        ...cls,
        type: 'class',
        title: cls.name,
        subtitle: `${cls.subject} • ${cls.teacher}`
      }));
      results.push(...classes);
    }
    
    if (permissions.canSearchResources) {
      const resources = mockData.resources.filter(resource =>
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.subject.toLowerCase().includes(query.toLowerCase()) ||
        resource.type.toLowerCase().includes(query.toLowerCase())
      ).map(resource => ({
        ...resource,
        type: 'resource',
        title: resource.title,
        subtitle: `${resource.subject} • ${resource.type}`
      }));
      results.push(...resources);
    }

    if (permissions.canSearchExams) {
      const exams = mockData.exams.filter(exam =>
        exam.title.toLowerCase().includes(query.toLowerCase()) ||
        exam.subject.toLowerCase().includes(query.toLowerCase()) ||
        exam.class.toLowerCase().includes(query.toLowerCase())
      ).map(exam => ({
        ...exam,
        type: 'exam',
        title: exam.title,
        subtitle: `${exam.subject} • ${exam.class}`
      }));
      results.push(...exams);
    }

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(results.length > 0);
  };

  return (
    <BNavbar expand="lg" className="shuleni-nav sticky-top">
      <Container fluid>
        {/* Sidebar toggle button for mobile */}
        {showSidebarToggle && (
          <Button
            variant="link"
            className="d-md-none text-white me-2 p-0"
            onClick={toggleSidebar}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            ☰
          </Button>
        )}

        {/* Brand logo */}
        <BNavbar.Brand 
          href="#" 
          className="text-white fw-bold fs-4 d-flex align-items-center"
          onClick={() => handleNavigation('/')}
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/favicon.svg" 
            alt="Shuleni Logo" 
            width="28" 
            height="28" 
            className="me-2"
          />
          Shuleni
        </BNavbar.Brand>

        <BNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </BNavbar.Toggle>

        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link 
                  href="#" 
                  className="text-white"
                  onClick={() => handleNavigation('/')}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  href="#" 
                  className="text-white"
                  onClick={() => handleNavigation('/class-list')}
                >
                  Classes
                </Nav.Link>
                <Nav.Link 
                  href="#" 
                  className="text-white"
                  onClick={() => handleNavigation('/resources')}
                >
                  Resources
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center">
            {/* Professional Search bar */}
            {isAuthenticated && (
              <div className="position-relative me-3">
                <Form onSubmit={handleSearch} className="d-flex">
                  <InputGroup style={{ minWidth: '300px' }}>
                    <Form.Control
                      type="search"
                      placeholder={permissions.searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      disabled={!isAuthenticated || Object.values(permissions).slice(0, -1).every(p => p === false)}
                      className="bg-white border-0 shadow-sm"
                      style={{ 
                        borderRadius: '25px 0 0 25px',
                        fontSize: '14px',
                        paddingLeft: '16px'
                      }}
                    />
                    <Button 
                      variant="light"
                      type="submit"
                      className="border-0 shadow-sm"
                      style={{ 
                        borderRadius: '0 25px 25px 0',
                        backgroundColor: '#f8f9fa',
                        color: '#6c757d'
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup>
                </Form>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div 
                    className="position-absolute top-100 start-0 w-100 bg-white border rounded-3 shadow-lg mt-1 p-2"
                    style={{ zIndex: 1050, maxHeight: '300px', overflowY: 'auto' }}
                  >
                    {searchResults.map((result, index) => (
                      <div 
                        key={index}
                        className="p-2 hover-bg-light rounded cursor-pointer"
                        onClick={() => {
                          // Handle result click
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {result.type === 'student' && '👨‍🎓'}
                            {result.type === 'teacher' && '👨‍🏫'}
                            {result.type === 'class' && '📚'}
                            {result.type === 'resource' && '📄'}
                          </div>
                          <div>
                            <div className="fw-medium text-dark">{result.name}</div>
                            <small className="text-muted">
                              {result.email || `${result.type.charAt(0).toUpperCase() + result.type.slice(1)}`}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="link" 
                  className="text-white text-decoration-none d-flex align-items-center"
                  id="user-dropdown"
                >
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40/FFFFFF/4A90E2?text=U'}
                    alt="Profile"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <span className="d-none d-sm-inline">{user?.name || 'User'}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="fw-bold">{user?.name}</div>
                    <div className="text-muted small">{user?.email}</div>
                    <div className="text-capitalize small">Role: {user?.role}</div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div>
                <Button 
                  variant="outline-light" 
                  className="me-2"
                  onClick={() => handleNavigation('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="light" 
                  onClick={() => handleNavigation('/create-school')}
                >
                  Create A School
                </Button>
              </div>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
};

export default Navbar;