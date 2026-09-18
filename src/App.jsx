import { useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Inicio from './Inicio';
import Buque from './Buque';
import Compartilhar from './Compartilhar';

import LoadingScreen from './LoadingScreen';

function AppContent() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/buque" element={<Buque />} />
        <Route path="/compartilhar/:codigo" element={<Compartilhar />} />
      </Routes>

      {loading && (
        <LoadingScreen
          onComplete={() => setLoading(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;