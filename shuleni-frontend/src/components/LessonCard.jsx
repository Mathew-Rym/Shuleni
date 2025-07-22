import React from 'react';
import { Card } from 'react-bootstrap';

const LessonCard = ({ title, content }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default LessonCard;