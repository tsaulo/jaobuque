// 1. Altere a importação:
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// 2. Envolva sua aplicação com o HashRouter:
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buque" element={<Buque />} />
        <Route path="/compartilhar/:codigo" element={<Compartilhar />} />
      </Routes>
    </Router>
  );
}

export default App;