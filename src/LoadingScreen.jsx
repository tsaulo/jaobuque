import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const imagens = [
  '../assets/fundoflores4.png',
  './assets/fundofloresmobile.png',
  './assets/flores/buque1.png',
  './assets/flores/buque2.png',
  './assets/flores/crisantemo.png',
  './assets/flores/lirio.png',
  './assets/flores/narciso.png',
  './assets/flores/rosa.png',
  './assets/flores/lavanda.png',
  './assets/flores/hortensia.png',
  './assets/flores/orquidea.png',
  './assets/flores/azaleia.png',
  './assets/flores/miosotis.png',
  './assets/flores/girassol.png',
  './assets/flores/tulipa.png',
  './assets/flores/margarida.png',
  './assets/flores/violeta.png',
  './assets/flores/cravo.png',
  './assets/botao.png',
];

const floresAnima = [
  './assets/flores/crisantemo.png',
  './assets/flores/lirio.png',
  './assets/flores/narciso.png',
  './assets/flores/rosa.png',
  './assets/flores/lavanda.png',
];

function LoadingScreen({ onComplete }) {
  const [progresso, setProgresso] = useState(0);
  const [florAtual, setFlorAtual] = useState(0);

  useEffect(() => {
    let carregadas = 0;
    let ativo = true;
    const inicioTempo = Date.now();
    const TEMPO_MINIMO_MS = 3000; // Altere aqui para a duração mínima em ms (ex: 3s)

    const finalizar = () => {
      const tempoDecorrido = Date.now() - inicioTempo;
      const tempoRestante = Math.max(0, TEMPO_MINIMO_MS - tempoDecorrido);

      setTimeout(() => {
        if (ativo && onComplete) {
          onComplete();
        }
      }, tempoRestante);
    };

    const incrementar = () => {
      if (!ativo) return;
      carregadas++;

      const porcentagem = Math.round((carregadas / imagens.length) * 100);
      setProgresso(porcentagem);

      if (carregadas >= imagens.length) {
        finalizar();
      }
    };

    if (imagens.length === 0) {
      finalizar();
      return;
    }

    imagens.forEach((src) => {
      const img = new Image();
      img.onload = incrementar;
      img.onerror = incrementar;
      img.src = src;
    });

    return () => {
      ativo = false;
    };
  }, [onComplete]);

  // Ciclo de pulso e troca das flores
  useEffect(() => {
    const intervalo = setInterval(() => {
      setFlorAtual((atual) => (atual + 1) % floresAnima.length);
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-flores">
        <img
          src={floresAnima[florAtual]}
          alt="Carregando..."
          className="loading-flor"
          key={florAtual}
        />
      </div>

      <div className="loading-texto">
        CARREGANDO {progresso}%
      </div>
    </div>
  );
}

export default LoadingScreen;