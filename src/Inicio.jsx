import './Inicio.css';
import { useNavigate } from 'react-router-dom';

function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="content">
        <button className="btn" onClick={() => navigate('/buque')}>
          <span>Iniciar</span>
        </button>
      </div>
    </div>
  );
}

export default Inicio;