import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Violations from "./pages/Violations"
import Home from "./pages/Home"

import './App.css'


function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f9f9f9]">
        <Navbar />
        <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/violations" element={<Violations />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
