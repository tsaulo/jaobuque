import './Compartilhar.css';

import { useParams, Link } from 'react-router-dom';

import { musicas } from './Musicas';

function Compartilhar() {
  const { codigo } = useParams();

  const ids = codigo ? codigo.split('-') : [];

  const selecionadas = ids
    .map((id) =>
      musicas.find(
        (musica) => String(musica.idurl ?? musica.id) === String(id)
      )
    )
    .filter(Boolean);

  if (selecionadas.length !== 5) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: '#fff'
        }}
      >
        <h2>Buquê não encontrado!</h2>

        <Link
          to="/buque"
          style={{
            color: '#fff',
            textDecoration: 'underline'
          }}
        >
          Voltar e montar buquê
        </Link>
      </div>
    );
  }

  
  const url = window.location.href;

  function copiarLink() {
    navigator.clipboard.writeText(url);
  }

  function compartilharWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Olha o buquê que eu montei! 🌸 ${url}`
      )}`,
      '_blank'
    );
  }

  function compartilharX() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        'Olha o buquê que eu montei! 🌸'
      )}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  }

  async function compartilharInstagram() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu buquê',
          text: 'Olha o buquê que eu montei! 🌸',
          url: url
        });
      } catch (erro) {
        // usuário cancelou o compartilhamento
      }
    } else {
      window.open('https://www.instagram.com/', '_blank');
    }
  }

const selecionadasComFlores = selecionadas.map((musica) => {
    // Clona as posições originais da música atual
    const posicoes = [...(musica.posicoes || [])];

    // Posições das flores de preenchimento
    const extras = [
      { x: 55, y: 47, tamanho: 60, rotacao: -8 },
      { x: 54, y: 50, tamanho: 85, rotacao: 12 },
      { x: 56, y: 48, tamanho: 70, rotacao: -15 },
      { x: 38, y: 43, tamanho: 85, rotacao: 8 },
      { x: 62, y: 53, tamanho: 58, rotacao: 20 },
      { x: 38, y: 55, tamanho: 72, rotacao: -12 },
      { x: 58, y: 40, tamanho: 65, rotacao: 14 },
      { x: 52, y: 58, tamanho: 50, rotacao: -5 },
      { x: 66, y: 57, tamanho: 60, rotacao: 20 },
      { x: 45, y: 57, tamanho: 73, rotacao: -18 },
      { x: 60, y: 55, tamanho: 72, rotacao: 10 },
      { x: 54, y: 45, tamanho: 45, rotacao: -12 },
    ];

    // Para cada posição extra, escolhemos uma imagem de flor ALEATÓRIA
    // dentre as 5 músicas selecionadas pelo usuário
    extras.forEach((extra) => {
      const musicaAleatoria = selecionadas[Math.floor(Math.random() * selecionadas.length)];
      
      posicoes.push({
        ...extra,
        // Sobrescrevemos a imagem padrão da posição pela imagem da flor sorteada
        imagem: musicaAleatoria.imagem 
      });
    });

    return {
      ...musica,
      posicoes,
    };
  });

  return (
    <main className="pagina-buque pagina-compartilhar">

      <section className="area-buque">

        <div className="buque-container">

          <div className="buque">

            <img
              src="/assets/flores/buque1.png"
              className="buque-fundo"
              alt=""
            />

            <div className="flores">
            {selecionadasComFlores.map((musica, index) => (
                <div key={index} className="grupo-flores">
                {musica.posicoes?.map((posicao, posIndex) => (
                    <img
                    key={posIndex}
                    /* USA A IMAGEM DA POSIÇÃO EXTRA (OU A IMAGEM DA MÚSICA COMO FALLBACK) */
                    src={posicao.imagem || musica.imagem} 
                    alt=""
                    className="flor"
                    style={{
                        left: `${posicao.x}%`,
                        top: `${posicao.y}%`,
                        width: `${posicao.tamanho}px`,
                        transform: `
                        translate(-50%, -50%)
                        rotate(${posicao.rotacao}deg)
                        `
                    }}
                    />
                ))}
                </div>
  ))}
                </div>

            <img
              src="/assets/flores/buque2.png"
              className="buque-frente"
              alt=""
            />

          </div>

          <div className="posicoes">

            {selecionadasComFlores.map((musica, index) => (

              <div
                className="posicao"
                key={index}
              >
                <span className="numero-posicao">
                  #{index + 1}
                </span>

                <span className="musica-posicao">
                  {musica.nome}
                </span>
              </div>

            ))}

          </div>

          <div className="flores-posicoes">

            {selecionadasComFlores.map((musica, index) => (

              <div
                className="flor-posicao"
                key={index}
              >
                {musica.flor}
              </div>

            ))}

          </div>

        </div>

        <div className="compartilhar-area">

          <h1>Compartilhe seu buquê!</h1>

          <div className="botoes-compartilhar">

            <button
              className="botao-compartilhar"
              onClick={copiarLink}
              aria-label="Copiar link"
            >
              <svg viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
                <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
              </svg>
            </button>

            <button
              className="botao-compartilhar"
              onClick={compartilharX}
              aria-label="Compartilhar no X"
            >
              <span className="icone-x">𝕏</span>
            </button>

            <button
              className="botao-compartilhar"
              onClick={compartilharInstagram}
              aria-label="Compartilhar no Instagram"
            >
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </button>

            <button
              className="botao-compartilhar"
              onClick={compartilharWhatsApp}
              aria-label="Compartilhar no WhatsApp"
            >
              <svg viewBox="0 0 24 24">
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
                <path d="M9 8.5c.3-.5.6-.5.9-.1l1 1.3c.2.3.2.6 0 .8l-.5.5c.5 1 1.3 1.8 2.3 2.3l.5-.5c.2-.2.5-.2.8 0l1.3 1c.4.3.4.6-.1.9-.5.3-1.1.4-1.7.2-2.7-.8-4.8-2.9-5.6-5.6-.2-.6-.1-1.2.1-1.7Z" />
              </svg>
            </button>

          </div>

          

        </div>

<Link
            to="/"
            className="botao-recomecar"
          >
            <span>Recomeçar</span>
          </Link>
      </section>

    </main>
  );
}

export default Compartilhar;