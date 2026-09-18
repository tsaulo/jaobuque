import './Inicio.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function Inicio() {
  const navigate = useNavigate()

  return (
    <div class="container">
      <div class="content">
        <button class="btn" onClick={() => navigate('/buque')}>
          <span>Iniciar</span>
        </button>
      </div>
    </div>
  )
}

export default Inicio