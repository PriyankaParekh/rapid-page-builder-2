import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import AddPage from "./components/AddPage";
import List from "./components/List";
import EditPage from "./components/EditPage";
import Preview from "./components/Preview";
import Nav from "./components/Nav";

function App() {
  return (
    <Router>
    <div>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Routes>
      <Route exact path="/" element={<Home />}></Route>
      <Route exact path="/nav" element={<Nav />}></Route>
      <Route exact path="/signup" element={<SignUp />}></Route>
      <Route exact path="/login" element={<SignIn />}></Route>
      <Route exact path="/addPage" element={<AddPage />}></Route>
      <Route exact path="/list" element={<List />}></Route>
      <Route exact path="/editpage/:id" element={<EditPage />}></Route>
      <Route exact path="/preview" element={<Preview />}></Route>
      </Routes>
    </div>
  </Router>
  );
}

export default App;
