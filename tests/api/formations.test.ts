import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getFormations, getFormationById, createFormation, updateFormation, deleteFormation } from '../../src/utils/formations';
import { validateResponse, validateRequest } from '../helpers/openapi';

describe('Formations API', () => {
  const testFormation = {
    id: '1',
    matchId: '1',
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    match: {
      id: '1',
      date: new Date(),
      competition: 'Test Competition',
      homeTeam: 'Home Team',
      awayTeam: 'Away Team',
      venue: 'Test Venue',
      played: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    players: [
      {
        id: '1',
        formationId: '1',
        playerId: '1',
        positionX: 50,
        positionY: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        player: {
          id: '1',
          name: 'Test Player',
          number: 10,
          position: 'Forward',
          image: 'test.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ]
  };

  test('should get all formations with valid response schema', async () => {
    prismaMock.formation.findMany.mockResolvedValue([testFormation]);
    const formations = await getFormations();
    expect(validateResponse('/formations', 'GET', 200, formations)).toBe(true);
  });

  test('should get formation by id with valid response schema', async () => {
    prismaMock.formation.findUnique.mockResolvedValue(testFormation);
    const formation = await getFormationById('1');
    expect(validateResponse('/formations/{id}', 'GET', 200, formation)).toBe(true);
  });

  test('should create formation with valid request and response schema', async () => {
    const createData = {
      matchId: '1',
      players: [
        {
          playerId: '1',
          positionX: 50,
          positionY: 50
        }
      ]
    };
    expect(validateRequest('/formations', 'POST', createData)).toBe(true);

    prismaMock.formation.create.mockResolvedValue(testFormation);
    const formation = await createFormation(createData);
    expect(validateResponse('/formations', 'POST', 201, formation)).toBe(true);
  });

  test('should update formation with valid request and response schema', async () => {
    const updateData = {
      players: [
        {
          playerId: '1',
          positionX: 60,
          positionY: 40
        }
      ],
      active: true
    };
    expect(validateRequest('/formations/{id}', 'PUT', updateData)).toBe(true);

    prismaMock.formation.update.mockResolvedValue({
      ...testFormation,
      players: [
        {
          ...testFormation.players[0],
          positionX: 60,
          positionY: 40
        }
      ],
      active: true
    });

    const formation = await updateFormation('1', updateData);
    expect(validateResponse('/formations/{id}', 'PUT', 200, formation)).toBe(true);
  });

  test('should delete formation', async () => {
    prismaMock.formation.delete.mockResolvedValue(testFormation);
    const result = await deleteFormation('1');
    expect(result).toBe(true);
  });
});