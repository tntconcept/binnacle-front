import React from "react";
import "./App.css";
import { BrowserRouter, Link, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import BinnaclePage from "./pages/binnacle/BinnaclePage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/binnacle/">Binnacle</Link>
            </li>
          </ul>
        </nav>

        <Route
          path="/"
          exact
          component={LoginPage} />
        <Route
          path="/binnacle/"
          component={BinnaclePage} />
      </div>
    </BrowserRouter>
  );
};

export default App;
