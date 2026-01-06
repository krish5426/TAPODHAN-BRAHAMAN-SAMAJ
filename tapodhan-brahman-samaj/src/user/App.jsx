import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Businesscontact from "./pages/Businesscontact";
import Layout from "./components/layout/Layout";
import './css/style.css';


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/business-contact" element={<Businesscontact />} />
      </Route>
    </Routes>
  );
}

export default App;