import { Routes, Route } from 'react-router-dom';
import UserHome from './user/App';
import AdminApp from './admin/AdminApp';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<UserHome />} />
      </Routes>
    </>
  );
}

export default App;
