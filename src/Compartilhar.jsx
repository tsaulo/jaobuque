import './Compartilhar.css';
import { useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { domToPng } from 'modern-screenshot';
import { musicas } from './Musicas';

import buque1Img from '/assets/flores/buque1.png';
import buque2Img from '/assets/flores/buque2.png';

function Compartilhar() {
  const { codigo } = useParams();
  const buqueContainerRef = useRef(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  const ids = codigo ? codigo.split('-') : [];

  const selecionadas = ids
    .map((id) =>
      musicas.find(
        (musica) => String(musica.idurl ?? musica.id) === String(id)
      )
    )
    .filter(Boolean);

  const selecionadasComFlores = useMemo(() => {
    if (selecionadas.length !== 5) return [];

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
      { x: 54, y: 45, tamanho: 45, rotacao: -12 }
    ];

    return selecionadas.map((musica) => {
      const posicoes = [...(musica.posicoes || [])];

      extras.forEach((extra) => {
        const musicaAleatoria =
          selecionadas[Math.floor(Math.random() * selecionadas.length)];
        posicoes.push({
          ...extra,
          imagem: musicaAleatoria.imagem
        });
      });

      return {
        ...musica,
        posicoes
      };
    });
  }, [codigo]);

  if (selecionadas.length !== 5) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
        <h2>Buquê não encontrado!</h2>
        <Link to="/buque" style={{ color: '#fff', textDecoration: 'underline' }}>
          Voltar e montar buquê
        </Link>
      </div>
    );
  }

  const url = window.location.href;

  const baixarImagemOuCompartilhar = async () => {
    setCarregandoImagem(true);

    try {
      await new Promise((r) => setTimeout(r, 500));

      const elemento = buqueContainerRef.current || document.querySelector('.buque-container');
      if (!elemento) {
        throw new Error('Elemento .buque-container não foi encontrado no DOM.');
      }

      const isMobile = window.innerWidth <= 700;
      const CAPTURE_SCALE = Math.max(window.devicePixelRatio || 1, 2) * 1.2;

      const pngDataUrl = await domToPng(elemento, {
        scale: CAPTURE_SCALE,
        fetchExternalStyles: true,
        features: {
          font: true,
        },
      });

      const img = new Image();
      img.src = pngDataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const larguraDesejadaStory = 1080;
      const alturaDesejadaStory = 1920;

      const canvasFinalStory = document.createElement('canvas');
      canvasFinalStory.width = larguraDesejadaStory;
      canvasFinalStory.height = alturaDesejadaStory;
      const ctxFinal = canvasFinalStory.getContext('2d');

      const fundoPath = isMobile
        ? '/assets/fundofloresmobile2.png'
        : '/assets/fundoflores5.png';

      const backgroundImage = new Image();
      backgroundImage.src = fundoPath;

      await new Promise((resolve) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = () => {
          backgroundImage.src = '/assets/fundoflores5.png';
          backgroundImage.onload = resolve;
        };
      });

      ctxFinal.drawImage(
        backgroundImage,
        0,
        0,
        larguraDesejadaStory,
        alturaDesejadaStory
      );

      const larguraOrigem = img.naturalWidth;
      const alturaOrigem = img.naturalHeight;

      const scaleRatio = Math.min(
        (larguraDesejadaStory * 0.9) / larguraOrigem,
        (alturaDesejadaStory * 0.85) / alturaOrigem
      );

      const imgWidthScaled = larguraOrigem * scaleRatio;
      const imgHeightScaled = alturaOrigem * scaleRatio;

      const xPos = Math.round((larguraDesejadaStory - imgWidthScaled) / 2);
      const yPos = Math.round((alturaDesejadaStory - imgHeightScaled) / 2);

      ctxFinal.drawImage(
        img,
        xPos,
        yPos,
        imgWidthScaled,
        imgHeightScaled
      );

      canvasFinalStory.toBlob(async (blob) => {
        if (!blob) return;

        const nomeArquivo = 'meu-buque.png';
        const file = new File([blob], nomeArquivo, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Meu Buquê',
              text: 'Olha só o buquê que eu criei!',
              files: [file],
            });
            return;
          } catch (err) {
            if (err.name === 'AbortError') return;
          }
        }

        const linkUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = nomeArquivo;
        link.href = linkUrl;
        link.click();

        setTimeout(() => URL.revokeObjectURL(linkUrl), 1000);
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao gerar a imagem:', error);
    } finally {
      setCarregandoImagem(false);
    }
  };

  function copiarLink() {
    navigator.clipboard.writeText(url);
    alert('Link copiado!');
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

  function compartilharInstagram() {
    baixarImagemOuCompartilhar();
  }

  return (
    <main className="pagina-buque pagina-compartilhar">
      <section className="area-buque">
        
        <div className="buque-container" ref={buqueContainerRef}>
          <header className="topo-logo">
            <img src="./assets/logo.png" alt="Logo" className="logo-pagina" />
          </header>

          <div className="buque">
            <img
              src={buque1Img}
              className="buque-fundo"
              alt="Buquê fundo"
            />

            <div className="flores">
              {selecionadasComFlores.map((musica, index) => (
                <div key={index} className="grupo-flores">
                  {musica.posicoes?.map((posicao, posIndex) => (
                    <img
                      key={posIndex}
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
              src={buque2Img}
              className="buque-frente"
              alt="Buquê frente"
            />
          </div>

          <div className="posicoes">
            {selecionadas.map((musica, index) => (
              <div className="posicao" key={index}>
                <span className="numero-posicao">#{index + 1}</span>
                <span className="musica-posicao">{musica.nome}</span>
              </div>
            ))}
          </div>

          <div className="flores-posicoes">
            {selecionadas.map((musica, index) => (
              <div className="flor-posicao" key={index}>
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
              onClick={baixarImagemOuCompartilhar}
              aria-label="Baixar Imagem"
              disabled={carregandoImagem}
            >
              {carregandoImagem ? '⌛' : '📸'}
            </button>

            <button className="botao-compartilhar" onClick={copiarLink} aria-label="Copiar link">
              <svg viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
                <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15" />
              </svg>
            </button>

            <button className="botao-compartilhar" onClick={compartilharInstagram} aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </button>

            <button className="botao-compartilhar" onClick={compartilharX} aria-label="Compartilhar no X">
              <span className="icone-x">𝕏</span>
            </button>

            <button className="botao-compartilhar" onClick={compartilharWhatsApp} aria-label="Compartilhar no WhatsApp">
              <svg viewBox="0 0 24 24">
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
                <path d="M9 8.5c.3-.5.6-.5.9-.1l1 1.3c.2.3.2.6 0 .8l-.5.5c.5 1 1.3 1.8 2.3 2.3l.5-.5c.2-.2.5-.2.8 0l1.3 1c.4.3.4.6-.1.9-.5.3-1.1.4-1.7.2-2.7-.8-4.8-2.9-5.6-5.6-.2-.6-.1-1.2.1-1.7Z" />
              </svg>
            </button>
          </div>
        </div>

        <Link to="/" className="botao-recomecar">
          <span>Recomeçar</span>
        </Link>
      </section>
    </main>
  );
}

export default Compartilhar;