// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPanel from "./views/AdminPanel";
import Dashboard from "./views/Dashboard";
import UserInterface from "./views/UserInterface";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin" Component={AdminPanel} />
                <Route path="/dashboard" Component={Dashboard} />
                <Route path="/user" Component={UserInterface} />
            </Routes>
        </Router>
    );
};

export default App;
