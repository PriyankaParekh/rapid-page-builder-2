import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Published from "./components/Published";
import Blog from "./components/Blog";

function App() {
  return (
    <Router>
    <div>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Routes>
      <Route exact path="/" element={<Published />}></Route>
      <Route exact path="/blog/:url" element={<Blog />}></Route>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
