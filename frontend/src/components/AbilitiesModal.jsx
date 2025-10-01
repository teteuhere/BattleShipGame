import React from "react";

// A reusable component for each ability button
const AbilityButton = ({ title, description, icon, onUse, used }) => (
  <div
    className={`p-4 rounded-lg border-2 ${
      used ? "bg-slate/10 border-slate/50" : "bg-navy/50 border-slate/30"
    }`}
  >
    <h3 className={`text-xl font-bold ${used ? "text-slate" : "text-white"}`}>
      {icon} {title}
    </h3>
    <p className={`mt-1 text-sm ${used ? "text-slate/60" : "text-slate"}`}>
      {description}
    </p>
    <button
      onClick={onUse}
      disabled={used}
      className={`w-full mt-3 font-bold py-2 px-4 rounded transition-colors ${
        used
          ? "bg-slate/30 text-slate/60 cursor-not-allowed"
          : "bg-accent/80 text-navy hover:bg-accent"
      }`}
    >
      {used ? "Utilizado" : "Ativar"}
    </button>
  </div>
);

function AbilitiesModal({
  player,
  onClose,
  onUseScout,
  onUseTorpedo,
  onUseEMP,
}) {
  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl max-w-lg w-full text-left relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-accent"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-accent mb-6 text-center">
          Arsenal de Habilidades
        </h2>

        <div className="space-y-4">
          <AbilityButton
            title="Avião Espião"
            icon="✈️"
            description="Revela uma área 2x2 aleatória no radar inimigo por um turno."
            onUse={onUseScout}
            used={player.used_scout_plane}
          />
          <AbilityButton
            title="Torpedo"
            icon="🚀"
            description="Dispara um torpedo que percorre uma linha ou coluna inteira, atingindo o primeiro navio no caminho."
            onUse={onUseTorpedo}
            used={player.used_torpedo}
          />
          <AbilityButton
            title="Pulso EMP"
            icon="⚡"
            description="Desativa os sistemas do oponente, fazendo com que ele perca o próximo turno."
            onUse={onUseEMP}
            used={player.used_emp}
          />
        </div>
      </div>
    </div>
  );
}

export default AbilitiesModal;
