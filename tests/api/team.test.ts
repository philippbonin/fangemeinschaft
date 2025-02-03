import { test, expect } from '@jest/globals';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from '../../src/utils/team';

describe('Team API', () => {
  let testPlayerId: string;

  const testPlayer = {
    name: 'Test Player',
    number: 99,
    position: 'Forward',
    image: 'https://example.com/player.jpg'
  };

  test('should create player', async () => {
    const player = await createPlayer(testPlayer);
    testPlayerId = player.id;
    
    expect(player).toHaveProperty('id');
    expect(player.name).toBe(testPlayer.name);
    expect(player.number).toBe(testPlayer.number);
  });

  test('should get all players', async () => {
    const players = await getPlayers();
    expect(Array.isArray(players)).toBe(true);
    expect(players.length).toBeGreaterThan(0);
  });

  test('should get player by id', async () => {
    const player = await getPlayerById(testPlayerId);
    expect(player).not.toBeNull();
    expect(player.id).toBe(testPlayerId);
  });

  test('should update player', async () => {
    const updatedPlayer = await updatePlayer(testPlayerId, {
      name: 'Updated Name'
    });
    expect(updatedPlayer).not.toBeNull();
    expect(updatedPlayer.name).toBe('Updated Name');
  });

  test('should delete player', async () => {
    const result = await deletePlayer(testPlayerId);
    expect(result).toBe(true);

    const deletedPlayer = await getPlayerById(testPlayerId);
    expect(deletedPlayer).toBeNull();
  });
});