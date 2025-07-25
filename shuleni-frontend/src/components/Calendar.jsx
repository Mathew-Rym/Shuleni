import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Calendar = ({ events = [], isAdmin = false, onEventAdd, onEventEdit, onEventDelete, className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    type: 'event',
    description: '',
    priority: 'medium'
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
      setShowEventDetails(true);
    } else if (isAdmin) {
      setEventForm({
        ...eventForm,
        date: dateStr
      });
      setShowEventModal(true);
    }
  };

  const handleEventSubmit = () => {
    if (selectedEvent) {
      onEventEdit && onEventEdit({ ...selectedEvent, ...eventForm });
    } else {
      onEventAdd && onEventAdd(eventForm);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setEventForm({
      title: '',
      date: '',
      time: '',
      type: 'event',
      description: '',
      priority: 'medium'
    });
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventForm(event);
    setShowEventModal(true);
    setShowEventDetails(false);
  };

  const handleDeleteEvent = (eventId) => {
    onEventDelete && onEventDelete(eventId);
    setShowEventDetails(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'exam': return 'danger';
      case 'event': return 'success';
      case 'meeting': return 'info';
      case 'holiday': return 'warning';
      default: return 'primary';
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && 
                         new Date().getFullYear() === currentDate.getFullYear();

  return (
    <div className={className}>
      <Card className="shuleni-card h-100">
        <Card.Body>
          {/* Calendar Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
              Important Dates
            </h5>
            {isAdmin && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => setShowEventModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add Event
              </Button>
            )}
          </div>

          {/* Month Navigation */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="outline-primary" size="sm" onClick={handlePrevMonth}>
              ‹
            </Button>
            <h6 className="mb-0 fw-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h6>
            <Button variant="outline-primary" size="sm" onClick={handleNextMonth}>
              ›
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Day Headers */}
            <div className="d-flex text-center small text-muted fw-bold mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="flex-fill py-1">{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="d-flex flex-wrap">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const isToday = isCurrentMonth && day === today;
                
                return (
                  <div
                    key={index}
                    className="calendar-day flex-fill d-flex flex-column align-items-center justify-content-center position-relative"
                    style={{
                      width: '14.28%',
                      height: '40px',
                      cursor: day ? 'pointer' : 'default',
                      border: '1px solid #eee',
                      backgroundColor: day ? (isToday ? '#e3f2fd' : 'white') : '#f8f9fa'
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    {day && (
                      <>
                        <span className={`small ${isToday ? 'fw-bold text-primary' : ''}`}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <div className="position-absolute bottom-0 start-50 translate-middle-x">
                            <div
                              className="rounded-circle"
                              style={{
                                width: '6px',
                                height: '6px',
                                backgroundColor: dayEvents[0].color || '#007bff'
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-3">
            <h6 className="fw-bold mb-2">Upcoming Events</h6>
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3)
                .map(event => (
                  <div
                    key={event.id}
                    className="d-flex justify-content-between align-items-center p-2 mb-2 border rounded"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDetails(true);
                    }}
                  >
                    <div>
                      <div className="fw-bold small">{event.title}</div>
                      <div className="text-muted small">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </div>
                    </div>
                    <Badge bg={getTypeColor(event.type)} className="small">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                <p className="text-muted small">No upcoming events</p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Event Details Modal */}
      <Modal show={showEventDetails} onHide={() => setShowEventDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <h5 className="fw-bold">{selectedEvent.title}</h5>
              <p className="text-muted mb-2">
                <strong>Date:</strong> {formatDate(selectedEvent.date)}
              </p>
              <p className="text-muted mb-2">
                <strong>Time:</strong> {selectedEvent.time}
              </p>
              <p className="text-muted mb-2">
                <strong>Type:</strong>{' '}
                <Badge bg={getTypeColor(selectedEvent.type)}>{selectedEvent.type}</Badge>
              </p>
              <p className="mb-3">{selectedEvent.description}</p>
              
              {isAdmin && (
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditEvent(selectedEvent)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </Button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Add/Edit Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                placeholder="Enter event title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Select
                value={eventForm.type}
                onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
              >
                <option value="event">Event</option>
                <option value="exam">Exam</option>
                <option value="meeting">Meeting</option>
                <option value="holiday">Holiday</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={eventForm.priority}
                onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                placeholder="Enter event description"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEventSubmit}>
            {selectedEvent ? 'Update Event' : 'Add Event'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
