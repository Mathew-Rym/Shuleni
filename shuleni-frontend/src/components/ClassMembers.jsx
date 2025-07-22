import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const ClassMembers = () => {
  const classMembers = [
    { name: 'Nathan', status: 'online' },
    { name: 'John', status: 'offline' },
    { name: 'George', status: 'online' },
    { name: 'Harry', status: 'offline' },
    { name: 'Dejon', status: 'online' },
  ];

  return (
    <Card>
      <Card.Body>
        <Card.Title>Class Members</Card.Title>
        <ListGroup variant="flush">
          {classMembers.map((member, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <span>{member.name}</span>
              <Badge bg={member.status === 'online' ? 'success' : 'secondary'} pill>
                {member.status === 'online' ? 'Online' : 'Offline'}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default ClassMembers;