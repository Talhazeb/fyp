import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pdf from "./components/Pdf";
import InvoicePDF from "./components/InvoicePDF";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserContext from "./context/UserContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProSidebarProvider } from "react-pro-sidebar";

import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  const [user, setUser] = React.useState({});
  return (
    <Provider store={store}>
      <div className="App">
        <ToastContainer />
        <ProSidebarProvider>
          <Router>
            <UserContext.Provider value={{ user, setUser }}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset/:token" element={<ResetPassword />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/viewPDF" element={<Pdf />} />
                <Route path="/invoicePDF" element={<InvoicePDF />} />
                <Route path="/viewPDF" element={<Pdf />} />
                <Route path="*" element={<h1>404: Not Found</h1>} />
              </Routes>
            </UserContext.Provider>
          </Router>
        </ProSidebarProvider>
      </div>
    </Provider>
  );
}

export default App;
