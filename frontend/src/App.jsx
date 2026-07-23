import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Doubts from './pages/Doubts';
import DoubtDetail from './pages/DoubtDetail';
import Notes from './pages/Notes';

function Home() {
  return <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Welcome to Campus Connect</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doubts" element={<Doubts />} />
        <Route path="/doubts/:id" element={<DoubtDetail />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;