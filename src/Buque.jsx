import './Buque.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicas } from './Musicas';

function Buque() {
  const navigate = useNavigate();

  const [selecionadas, setSelecionadas] = useState([]);
  const [previsualizada, setPrevisualizada] = useState(null);
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);

  function visualizarMusica(musica) {
    if (previsualizada?.nome === musica.nome) {
      setPrevisualizada(null);
      setDescricaoExpandida(false);
      return;
    }

    setPrevisualizada(musica);
    setDescricaoExpandida(false);
  }

  function adicionarMusica(musica) {
    setSelecionadas((atuais) => {
      if (atuais.some((item) => item.nome === musica.nome)) {
        return atuais;
      }

      if (atuais.length >= 5) {
        return atuais;
      }

      return [...atuais, musica];
    });
  }

  function removerMusica(musica) {
    setSelecionadas((atuais) =>
      atuais.filter((item) => item.nome !== musica.nome)
    );
  }

  function confirmar() {
    if (selecionadas.length !== 5) return;

    const codigo = selecionadas.map((m) => m.idurl ?? m.id).join('-');
    navigate(`/compartilhar/${codigo}`);
  }

  return (
    <main className="pagina-buque">
      <section className="area-buque">
        {/* CONTAINER AGRUPADO: POSIÇÕES, BUQUÊ E FLORES */}
        <div className="buque-wrapper">
          {/* COLUNA ESQUERDA: POSIÇÕES E NOMES DAS MÚSICAS */}
          <div className="posicoes">
            {[0, 1, 2, 3, 4].map((index) => (
              <div className="posicao" key={index}>
                <span className="numero-posicao">
                  #{index + 1}
                </span>
                <span className="musica-posicao">
                  {selecionadas[index]?.nome || ''}
                </span>
              </div>
            ))}
          </div>

          {/* CENTRO: O BUQUÊ COM AS FLORES */}
          <div className="buque-container">
            <div className="buque">
              <img
                src="./assets/flores/buque1.png"
                className="buque-fundo"
                alt=""
              />

              <div className="flores">
                {selecionadas.map((musica) => (
                  <div
                    key={`selecionada-${musica.nome}`}
                    className="grupo-flores"
                  >
                    {musica.posicoes.map((posicao, index) => (
                      <img
                        key={index}
                        src={musica.imagem}
                        alt={index === 0 ? musica.flor : ''}
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

                {previsualizada &&
                  !selecionadas.some(
                    (item) => item.nome === previsualizada.nome
                  ) && (
                    <div className="grupo-flores flor-previa">
                      {previsualizada.posicoes.map((posicao, index) => (
                        <img
                          key={index}
                          src={previsualizada.imagem}
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
                  )}
              </div>

              <img
                src="./assets/flores/buque2.png"
                className="buque-frente"
                alt=""
              />
            </div>
          </div>

          {/* COLUNA DIREITA: NOMES DAS FLORES */}
          <div className="flores-posicoes">
            {[0, 1, 2, 3, 4].map((index) => (
              <div className="flor-posicao" key={index}>
                {selecionadas[index]?.flor || ''}
              </div>
            ))}
          </div>
        </div>

        {/* TOOLTIP */}
        {previsualizada && (
          <div className={`info-musica ${descricaoExpandida ? 'expandida' : ''}`}>
            <div className="info-musica-conteudo">
              <div className="info-musica-texto">
                <h2>{previsualizada.nome}</h2>

                <p dangerouslySetInnerHTML={{ __html: previsualizada.descricao }} />

                <p
                  className={`descricao-longa ${
                    descricaoExpandida ? 'visivel' : ''
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: previsualizada.descricaolonga
                  }}
                />
              </div>
              <button
                className="botao-expandir"
                onClick={() => setDescricaoExpandida(!descricaoExpandida)}
                aria-label={descricaoExpandida ? 'Ver menos' : 'Ver mais'}
              >
                <span
                  className={`icone-expandir ${
                    descricaoExpandida ? 'icone-reduzir' : ''
                  }`}
                ></span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* LISTA DE MÚSICAS */}
      <section className="painel-musicas">
        <h1>Músicas</h1>

        <div className="lista-musicas">
          {musicas.map((musica) => {
            const adicionada = selecionadas.some(
              (item) => item.nome === musica.nome
            );

            const estaPrevisualizada =
              previsualizada?.nome === musica.nome;

            return (
              <div
                key={musica.nome}
                className={`musica ${
                  adicionada ? 'musica-selecionada' : ''
                } ${
                  estaPrevisualizada ? 'musica-previsualizada' : ''
                }`}
              >
                <button
                  className="nome-musica-botao"
                  onClick={() => visualizarMusica(musica)}
                >
                  <span className="nome-musica">
                    {musica.nome}
                  </span>
                </button>

                {(adicionada || estaPrevisualizada) && (
                  <button
                    className="botao-adicionar"
                    onClick={() =>
                      adicionada
                        ? removerMusica(musica)
                        : adicionarMusica(musica)
                    }
                    aria-label={
                      adicionada
                        ? `Remover ${musica.nome}`
                        : `Adicionar ${musica.nome}`
                    }
                  >
                    {adicionada ? '–' : '+'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="area-confirmar">
          <button
            className={`botao-confirmar ${
              selecionadas.length === 5 ? 'ativo' : ''
            }`}
            onClick={confirmar}
            disabled={selecionadas.length !== 5}
          >
            <span>Confirmar</span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default Buque;