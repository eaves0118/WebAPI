import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Wards from "./components/Wards";
import Nurses from "./components/Nurses";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/wards">Wards</Link> | <Link to="/nurses">Nurses</Link>
      </nav>
      <Routes>
        <Route path="/wards" element={<Wards />} />
        <Route path="/nurses" element={<Nurses />} />
      </Routes>
    </Router>
  );
}

export default App;
