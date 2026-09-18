import './App.css';
import Inicio from './Inicio.jsx';
import Buque from './Buque.jsx';
import Compartilhar from './Compartilhar.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/buque" element={<Buque />} />
        <Route path="/compartilhar/:codigo" element={<Compartilhar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;