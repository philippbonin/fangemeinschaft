import React, { useState, useRef, useEffect } from 'react';
import type { Player } from '../../types/player';

interface FormationEditorProps {
  players: Player[];
  initialFormation?: {
    players: {
      id: string;
      x: number;
      y: number;
    }[];
  };
}

interface PlayerPosition {
  id: string;
  x: number;
  y: number;
}

export default function FormationEditor({ players, initialFormation }: FormationEditorProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [positions, setPositions] = useState<PlayerPosition[]>(
    initialFormation?.players || []
  );
  const [draggingPlayer, setDraggingPlayer] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Handle player selection
  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  // Calculate position from mouse event
  const calculatePosition = (e: React.MouseEvent | MouseEvent) => {
    if (!fieldRef.current) return null;
    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  };

  // Handle field click to position player
  const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedPlayer || draggingPlayer) return;

    const pos = calculatePosition(e);
    if (!pos) return;

    setPositions((prev) => {
      const newPositions = prev.filter((p) => p.id !== selectedPlayer);
      return [...newPositions, { id: selectedPlayer, ...pos }];
    });

    setSelectedPlayer(null);
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation();
    setDraggingPlayer(playerId);
  };

  // Handle player removal
  const handleRemovePlayer = (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation();
    setPositions((prev) => prev.filter((p) => p.id !== playerId));
  };

  // Handle drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingPlayer) return;

      const pos = calculatePosition(e);
      if (!pos) return;

      setPositions((prev) => {
        const newPositions = prev.filter((p) => p.id !== draggingPlayer);
        return [...newPositions, { id: draggingPlayer, ...pos }];
      });
    };

    const handleMouseUp = () => {
      setDraggingPlayer(null);
    };

    if (draggingPlayer) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingPlayer]);

  // Update hidden input with positions data
  useEffect(() => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'positions';
    input.value = JSON.stringify(positions);
    document.querySelector('form')?.appendChild(input);

    return () => {
      input.remove();
    };
  }, [positions]);

  return (
    <div className="space-y-6">
      {/* Player Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => handlePlayerSelect(player.id!)}
            className={`p-4 rounded-lg border ${
              selectedPlayer === player.id
                ? 'border-secondary bg-secondary/10'
                : 'border-gray-200 hover:border-secondary/50'
            } ${
              positions.some((p) => p.id === player.id)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={positions.some((p) => p.id === player.id)}
          >
            <div className="text-2xl font-bold">#{player.number}</div>
            <div className="font-medium">{player.name}</div>
            <div className="text-sm text-gray-500">{player.position}</div>
          </button>
        ))}
      </div>

      {/* Field */}
      <div
        ref={fieldRef}
        className="relative w-full h-[600px] bg-gradient-to-b from-[#4caf50] to-[#388e3c] cursor-crosshair"
        onClick={handleFieldClick}
      >
        {/* Field markings */}
        <div className="absolute inset-0 flex flex-col">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/50 rounded-full"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/50 transform -translate-y-1/2"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-24 border-2 border-white/50"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-24 border-2 border-white/50"></div>
        </div>

        {/* Positioned Players */}
        {positions.map((position) => {
          const player = players.find((p) => p.id === position.id);
          if (!player) return null;

          return (
            <div
              key={position.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-center group ${
                draggingPlayer === position.id ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              onMouseDown={(e) => handleDragStart(e, position.id)}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-1 mx-auto hover:shadow-lg transition-shadow">
                  <span className="text-sm font-bold">#{player.number}</span>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemovePlayer(e, position.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-white text-sm font-semibold whitespace-nowrap">
                  {player.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-500">
        1. Wählen Sie einen Spieler aus der Liste aus
        2. Klicken Sie auf die gewünschte Position auf dem Spielfeld
        3. Ziehen Sie die Spieler mit der Maus, um ihre Position anzupassen
        4. Klicken Sie auf das rote X, um einen Spieler zu entfernen
        5. Wiederholen Sie den Vorgang für alle Spieler
      </div>
    </div>
  );
}