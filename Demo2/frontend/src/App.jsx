import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Doctors from "./components/Doctors";
import Hospitals from "./components/Hospitals";
import "./App.css";
function App() {
  return (
    <div className="container">
      <Router>
        <nav>
          <Link to="/">Hospitals</Link>
          <Link to="/doctors">Doctors</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Hospitals />} />
          <Route path="/doctors" element={<Doctors />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
