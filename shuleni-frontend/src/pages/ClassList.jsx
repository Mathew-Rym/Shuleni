import React from 'react';
import ClassCard from '../components/ClassCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './ClassList.css'

const ClassList = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Sample class data
  const classes = [
    {
      id: 1,
      color: '#3689e6',
      code: "M101",
      name: "Mathematics 101",
      term: ""
    },
    {
      id: 2,
      color: '#68b723',
      code: "G102",
      name: "Geography 102",
      term: ""
    },
    {
      id: 3,
      color: '#f9c440',
      code: "H495",
      name: "History of Art 495",
      term: ""
    },
    {
      id: 4,
      color: '#ed5353',
      code: "CIS120AF 18329",
      name: "PHOTOSHOP",
      term: "FINAL YEAR"
    },
    {
      id: 5,
      color: '#8e44ad',
      code: "BIO 101",
      name: "Biology 101",
      term: ""
    },
    {
      id: 6,
      color: '#0d94e7',
      code: "GC Reimagine Project",
      name: "Reimagine Project",
      term: ""
    }
  ];

  return (
     <div className="min-vh-100 bg-light">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showSidebarToggle={true} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="class-list-page">
      <h1>My Classes</h1>
      <div className="class-grid">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            id={classItem.id}
            color={classItem.color}
            code={classItem.code}
            name={classItem.name}
            term={classItem.term}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default ClassList;