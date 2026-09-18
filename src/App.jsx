import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './Inicio';
import Buque from './Buque';
import Compartilhar from './Compartilhar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/buque" element={<Buque />} />
        <Route path="/compartilhar/:codigo" element={<Compartilhar />} />
      </Routes>
    </Router>
  );
}

export default App;