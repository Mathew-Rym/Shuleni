import React, { useState } from 'react';
import { Card, ListGroup, Form, Button, Badge } from 'react-bootstrap';

const Chat= ({ messages, onSendMessage, currentUser }) => {

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Class Chat</span>
        <Badge bg="primary" pill>{messages.length}</Badge>
      </Card.Header>
      
      <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {messages.map((message) => (
            <ListGroup.Item key={message.id} className="border-0">
              <div className="d-flex justify-content-between">
                <strong>{message.user.name}:</strong>
                <small className="text-muted">
                  {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
              <div>{message.message}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      
      <Card.Footer>
        <Form onSubmit={handleSend}>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="Type Your Message Here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Send
          </Button>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default Chat;