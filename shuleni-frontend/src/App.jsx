import React from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Class from './pages/Classes.jsx'
import ExamTaking from './pages/ExamTaking.jsx'
import './App.css'

function App() {
  return (
   <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/classes" element={<Class />} />
        <Route path="/exam/" element={<ExamTaking />} />
      </Routes>
    </main>
    </Router>
  )
}

export default App
