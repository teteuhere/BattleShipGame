import React from "react";

function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] animate-fade-in">
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl max-w-2xl w-full text-left relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl hover:text-accent transition-colors"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-accent mb-6 text-center">
          🏆 Guia Completo do Batalha Naval 🏆
        </h2>

        <div className="space-y-6 text-slate">
          <div>
            <h3 className="font-bold text-white text-2xl mb-2">📜 O Básico</h3>
            <p>
              Bem-vindo, Comandante! Seu objetivo é simples: afundar toda a
              frota inimiga antes que afundem a sua. O jogo acontece em turnos,
              onde cada jogador dispara um tiro em um local do tabuleiro
              adversário.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-2xl mb-2">
              🛠️ Fase 1: Posicionamento da Frota
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                No início do jogo, você deve posicionar sua frota de 5 navios em
                seu tabuleiro.
              </li>
              <li>
                <strong>Para posicionar:</strong> Selecione um navio da lista e
                clique em uma célula no seu tabuleiro.
              </li>
              <li>
                <strong>Para rotacionar:</strong> Use o botão{" "}
                <strong>"Rotacionar"</strong> ou pressione a tecla{" "}
                <strong>CTRL</strong> para alternar entre horizontal e vertical.
              </li>
              <li>
                <strong>Atenção:</strong> Os navios não podem se sobrepor!
                Planeje com cuidado a sua formação.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-2xl mb-2">
              💥 Fase 2: Combate!
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                Na sua vez, clique em uma célula no{" "}
                <strong>"Radar Inimigo"</strong> para disparar um tiro.
              </li>
              <li>Um acerto será marcado com um ícone de fogo (🔥).</li>
              <li>Um erro será marcado com um ícone de círculo (●).</li>
              <li>
                <strong>Reação em Cadeia:</strong> Cuidado! Um acerto direto em
                um navio pode causar uma reação em cadeia, afundando outros
                navios que estejam adjacentes (nos 8 quadrados ao redor) a
                qualquer parte do navio atingido. Uma única jogada pode virar o
                jogo!
              </li>
              <li>
                O primeiro jogador a afundar todos os 5 navios do oponente vence
                a batalha!
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-2xl mb-2">
              🕹️ Modos de Jogo
            </h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Modo Clássico:</strong> A experiência tradicional. Um
                tiro por turno. Estratégia e paciência são as chaves para a
                vitória.
              </li>
              <li>
                <strong>Modo Salvo (Rápido):</strong> Um modo de jogo mais
                rápido e caótico! No seu turno, você pode disparar um número de
                tiros igual ao número de navios que você ainda tem flutuando. Se
                você tem 5 navios, você dispara 5 tiros!
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-2xl mb-2">
              🚀 Arsenal de Habilidades (Opcional)
            </h3>
            <p className="mb-2">
              Em partidas PvP, você pode optar por ativar o Arsenal! Cada
              jogador recebe três habilidades únicas para usar uma vez por jogo.
              Use-as sabiamente!
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>✈️ Avião Espião:</strong> Revela uma área 2x2 aleatória
                no radar inimigo por um turno, mostrando se há partes de navios
                na área com um '❓'.
              </li>
              <li>
                <strong>🚀 Torpedo:</strong> Dispara um projétil que percorre
                uma linha ou coluna inteira, atingindo o primeiro navio que
                encontrar em seu caminho.
              </li>
              <li>
                <strong>⚡ Pulso EMP:</strong> Desativa os sistemas do oponente,
                fazendo com que ele perca o próximo turno. Uma jogada tática
                para ganhar vantagem!
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-2xl mb-2">
              🤖 Oponente IA
            </h3>
            <p>
              No modo Jogador vs. IA, você enfrentará uma inteligência
              artificial com a estratégia 'Hunter-Killer'. Após conseguir um
              acerto, a IA irá "caçar" nos quadrados adjacentes para afundar o
              navio rapidamente antes de procurar em outros lugares. Não a
              subestime!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
