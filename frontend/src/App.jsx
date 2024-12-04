import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
