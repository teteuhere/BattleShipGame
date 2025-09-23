import React from 'react';

function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl max-w-lg w-full text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">
          &times;
        </button>
        <h2 className="text-3xl font-bold text-accent mb-4">Ajuda: Batalha Naval</h2>
        <div className="space-y-4 text-slate">
          <p>
            Bem-vindo ao Batalha Naval! Aqui estão algumas dicas para começar a jogar:
          </p>
          <h3 className="font-bold text-white text-xl">Como Posicionar seus Navios:</h3>
          <p>
            Na fase de "Posicionamento", clique em uma célula no seu tabuleiro para colocar um navio. Você pode usar o botão "Rotacionar" para mudar a orientação do navio entre horizontal e vertical. Certifique-se de que nenhum navio se sobreponha!
          </p>
          <h3 className="font-bold text-white text-xl">Como Jogar:</h3>
          <p>
            Na tela de batalha, é a sua vez de atacar! Clique em uma célula no **"Radar Inimigo"** para disparar um tiro. Se você acertar um navio, a célula ficará vermelha (🔥). Se você errar, ela ficará cinza (●). O primeiro jogador a afundar todos os navios do oponente vence!
          </p>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;