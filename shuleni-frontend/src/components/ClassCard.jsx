import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ id, color, code, name, term }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/class/${id}`);
  };

  return (
    <div 
      className="class-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`Open ${name} class`}
    >
      <div 
        className="class-card-header" 
        style={{ backgroundColor: color || '#1976d2' }}
      />
      <div className="class-card-content">
        <div className="class-code">{code}</div>
        <h3 className="class-name">{name}</h3>
        <div className="class-term">{term}</div>
      </div>
    </div>
  );
};

export default ClassCard;