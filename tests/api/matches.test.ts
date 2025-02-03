import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getMatches, getMatchById, createMatch, updateMatch, deleteMatch } from '../../src/utils/matches';
import { validateResponse, validateRequest } from '../helpers/openapi';

describe('Matches API', () => {
  const testMatch = {
    id: '1',
    date: new Date(),
    competition: 'Bundesliga',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    homeScore: null,
    awayScore: null,
    venue: 'Test Stadium',
    played: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  test('should get all matches with valid response schema', async () => {
    prismaMock.match.findMany.mockResolvedValue([testMatch]);
    const matches = await getMatches();
    expect(validateResponse('/matches', 'GET', 200, matches)).toBe(true);
  });

  test('should get match by id with valid response schema', async () => {
    prismaMock.match.findUnique.mockResolvedValue(testMatch);
    const match = await getMatchById('1');
    expect(validateResponse('/matches/{id}', 'GET', 200, match)).toBe(true);
  });

  test('should create match with valid request and response schema', async () => {
    const { id, createdAt, updatedAt, ...createData } = testMatch;
    expect(validateRequest('/matches', 'POST', createData)).toBe(true);

    prismaMock.match.create.mockResolvedValue(testMatch);
    const match = await createMatch(createData);
    expect(validateResponse('/matches', 'POST', 201, match)).toBe(true);
  });

  test('should update match with valid request and response schema', async () => {
    const updateData = { homeScore: 2, awayScore: 1, played: true };
    expect(validateRequest('/matches/{id}', 'PUT', updateData)).toBe(true);

    prismaMock.match.update.mockResolvedValue({ ...testMatch, ...updateData });
    const match = await updateMatch('1', updateData);
    expect(validateResponse('/matches/{id}', 'PUT', 200, match)).toBe(true);
  });

  test('should delete match', async () => {
    prismaMock.match.delete.mockResolvedValue(testMatch);
    const result = await deleteMatch('1');
    expect(result).toBe(true);
  });
});