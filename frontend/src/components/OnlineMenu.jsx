import React, { useState } from 'react';

function OnlineMenu({ onHost, onJoin, onError }) {
    const [hostName, setHostName] = useState('');
    const [joinName, setJoinName] = useState('');
    const [gameCode, setGameCode] = useState('');

    const handleHost = () => {
        if (!hostName.trim()) {
            onError('Por favor, digite seu nome para criar um jogo.');
            return;
        }
        onHost(hostName);
    };

    const handleJoin = () => {
        if (!joinName.trim() || !gameCode.trim()) {
            onError('Por favor, digite seu nome e o código do jogo para entrar.');
            return;
        }
        onJoin(gameCode, joinName);
    };


    return (
        <div className="flex flex-col md:flex-row gap-8 animate-fade-in w-full max-w-3xl">
            {/* Host Game Section */}
            <div className="flex-1 bg-navy/50 p-6 rounded-lg border border-slate/30">
                <h2 className="text-2xl text-accent mb-4 text-center">Criar uma partida</h2>
                <input
                    type="text"
                    placeholder="Seu nome"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full bg-light-navy text-white p-3 rounded-md border-2 border-slate/50 focus:border-accent focus:outline-none mb-4"
                />
                <button
                    onClick={handleHost}
                    className="w-full bg-accent text-navy font-bold py-3 px-4 rounded-md text-lg hover:bg-accent/80 transition-colors"
                >
                    Criar
                </button>
            </div>

            {/* Join Game Section */}
            <div className="flex-1 bg-navy/50 p-6 rounded-lg border border-slate/30">
                <h2 className="text-2xl text-accent mb-4 text-center">Ingressar na partida</h2>
                <input
                    type="text"
                    placeholder="Seu nome"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    className="w-full bg-light-navy text-white p-3 rounded-md border-2 border-slate/50 focus:border-accent focus:outline-none mb-4"
                />
                <input
                    type="text"
                    placeholder="Código da partida"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                    className="w-full bg-light-navy text-white p-3 rounded-md border-2 border-slate/50 focus:border-accent focus:outline-none mb-4"
                    maxLength="6"
                />
                <button
                    onClick={handleJoin}
                    className="w-full bg-accent text-navy font-bold py-3 px-4 rounded-md text-lg hover:bg-accent/80 transition-colors"
                >
                    Ingressar
                </button>
            </div>
        </div>
    );
}

export default OnlineMenu;
