import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Register from "./pages/Register";
import BusinessRegister from "./pages/BusinessRegister";
import MyBusiness from "./pages/MyBusiness";
import EditBusiness from "./pages/EditBusiness";
import BusinessDetail from "./pages/BusinessDetail";
import EditProfile from "./pages/EditProfile";
import MyMatrimonyProfile from "./pages/MyMatrimonyProfile";
import Businesscontact from "./pages/Businesscontact";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Matrimonial from "./pages/Matrimonial";
import Profile from "./pages/Profile";
import MatrimonialPersonalInfo from "./pages/MatrimonialPersonalInfo";
import MatrimonialDetail from "./pages/MatrimonialDetail";
import Donate from "./pages/Donate";
import Announcements from "./pages/Announcements";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import './css/style.css';
import './css/matrimonial.css';
import './css/google-translate.css';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/register" element={<Register />} />
        <Route path="/business-register" element={
          <ProtectedRoute>
            <BusinessRegister />
          </ProtectedRoute>
        } />
        <Route path="/my-business" element={
          <ProtectedRoute>
            <MyBusiness />
          </ProtectedRoute>
        } />
        <Route path="/edit-business/:id" element={
          <ProtectedRoute>
            <EditBusiness />
          </ProtectedRoute>
        } />
        <Route path="/business-detail/:id" element={
          <ProtectedRoute>
            <BusinessDetail />
          </ProtectedRoute>
        } />
        <Route path="/business-contact" element={<Businesscontact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/events" element={<Events />} />
        <Route path="/matrimonial" element={<Matrimonial />} />
        <Route path="/matrimonial-detail/:id" element={<MatrimonialDetail />} />
        <Route path="/matrimonial-personal-info" element={<MatrimonialPersonalInfo />} />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/my-matrimony-profile" element={
          <ProtectedRoute>
            <MyMatrimonyProfile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;