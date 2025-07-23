import React from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Class from './pages/Classes.jsx'
import ExamTaking from './pages/ExamTaking.jsx'
import ExamOverview from './pages/ExamOverview.jsx'
import Resources from './pages/Resources.jsx'
import ResourceDetail from './pages/ResourceDetail.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
   <Router>
    <Header />
    <main>
      <Routes>
        <Route path="/classes" element={<Class />} />
        <Route path="/exam-taking" element={<ExamTaking />} />
        <Route path="/exam-overview" element={<ExamOverview />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
      </Routes>
    </main>
    </Router>
  )
}

export default App
