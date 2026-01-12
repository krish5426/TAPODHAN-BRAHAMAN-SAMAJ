import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Register from "./pages/Register";
import BusinessRegister from "./pages/BusinessRegister";
import Businesscontact from "./pages/Businesscontact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Matrimonial from "./pages/Matrimonial";
import Profile from "./pages/Profile";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import './css/style.css';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/business-register" element={
          <ProtectedRoute>
            <BusinessRegister />
          </ProtectedRoute>
        } />
        <Route path="/business-contact" element={<Businesscontact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route path="/matrimonial" element={<Matrimonial />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;