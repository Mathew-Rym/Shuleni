import React, { useState } from 'react';
import { Card, ListGroup, Form, Button, Badge } from 'react-bootstrap';

const Chat= () => {

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      user: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <Card>
    </Card>
  );
};

export default Chat;