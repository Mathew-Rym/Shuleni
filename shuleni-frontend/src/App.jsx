import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header.jsx'
import Class from './pages/Class.jsx'
import { useState } from 'react'
import './App.css'

function App() {
  return (
   <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/class/:classId" element={<ClassPage />} />
      </Routes>
    </main>
    </Router>
  )
}

export default App
