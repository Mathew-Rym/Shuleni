import React, { useState } from "react";
import { Card, Button, Badge, Modal, ListGroup } from 'react-bootstrap';
import './Calendar.css';

function Calendar({ events = [], onEventAdd, onEventEdit, onEventDelete, isAdmin = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventsModal, setShowEventsModal] = useState(false);

  // Get calendar data
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (day) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
    const dayEvents = getEventsForDate(dateStr);
    if (dayEvents.length > 0) {
      setShowEventsModal(true);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
          onClick={() => handleDateClick(day)}
          style={{ cursor: 'pointer' }}
        >
          <div className="day-number">{day}</div>
          {dayEvents.length > 0 && (
            <div className="events-indicator">
              <Badge bg="primary" className="small">
                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-component">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-secondary" size="sm" onClick={getPreviousMonth}>
              ←
            </Button>
            <h5 className="mb-0">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h5>
            <Button variant="outline-secondary" size="sm" onClick={getNextMonth}>
              →
            </Button>
          </div>
          {isAdmin && onEventAdd && (
            <Button variant="primary" size="sm" onClick={() => onEventAdd()}>
              <i className="fas fa-plus me-2"></i>Add Event
            </Button>
          )}
        </Card.Header>
        <Card.Body className="p-0">
          <div className="calendar-grid">
            {/* Week day headers */}
            <div className="calendar-header">
              {weekDays.map(day => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="calendar-body">
              {renderCalendarDays()}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Events Modal */}
      <Modal show={showEventsModal} onHide={() => setShowEventsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Events for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDate && (
            <ListGroup>
              {getEventsForDate(selectedDate).map(event => (
                <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{event.title}</h6>
                    <p className="mb-1 text-muted">{event.description}</p>
                    <small className="text-muted">
                      {event.time && `Time: ${event.time}`}
                      {event.type && ` • Type: ${event.type}`}
                      {event.targetAudience && ` • For: ${
                        event.targetAudience === 'both' ? 'All' :
                        event.targetAudience === 'teachers' ? 'Teachers' :
                        event.targetAudience === 'students' ? 'Students' : 'All'
                      }`}
                    </small>
                  </div>
                  {isAdmin && (
                    <div className="d-flex gap-1">
                      {onEventEdit && (
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => onEventEdit(event)}
                        >
                          Edit
                        </Button>
                      )}
                      {onEventDelete && (
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => onEventDelete(event.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </ListGroup.Item>
              ))}
              {getEventsForDate(selectedDate).length === 0 && (
                <ListGroup.Item className="text-center text-muted">
                  No events for this date
                </ListGroup.Item>
              )}
            </ListGroup>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Calendar;