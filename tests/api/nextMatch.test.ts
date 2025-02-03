// tests/api/nextMatch.test.ts
import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getNextMatch, getNextMatchHistory, updateNextMatch, setActiveNextMatch } from '../../src/utils/nextMatch';

describe('NextMatch API', () => {
  const testMatch = {
    id: '1',
    matchId: '1',
    ticketLink: 'https://tickets.com',
    moreInfoContent: 'Test info',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    match: {
      id: '1',
      date: new Date(),
      competition: 'Test League',
      homeTeam: 'Home',
      awayTeam: 'Away',
      venue: 'Test Stadium',
      played: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  test('should get active next match', async () => {
    prismaMock.nextMatch.findFirst.mockResolvedValue(testMatch);
    const match = await getNextMatch();
    expect(match).toEqual(testMatch);
  });

  test('should get next match history', async () => {
    const historyEntry = {
      ...testMatch,
      activatedAt: new Date(),
      deactivatedAt: new Date()
    };
    prismaMock.nextMatchHistory.findMany.mockResolvedValue([historyEntry]);
    const history = await getNextMatchHistory();
    expect(history).toEqual([historyEntry]);
  });

  test('should update next match', async () => {
    const updateData = {
      id: '1',
      ticketLink: 'https://new-tickets.com',
      moreInfoContent: 'Updated info'
    };

    prismaMock.nextMatch.update.mockResolvedValue({
      ...testMatch,
      ...updateData
    });

    const match = await updateNextMatch(updateData);
    expect(match.ticketLink).toBe(updateData.ticketLink);
    expect(match.moreInfoContent).toBe(updateData.moreInfoContent);
  });

  test('should set active next match', async () => {
    prismaMock.$transaction.mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return callback(prismaMock);
      }
      return callback;
    });

    await setActiveNextMatch('1');

    expect(prismaMock.nextMatch.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { active: true }
    });
  });
});
// tests/api/nextMatch.test.ts
import { test, expect } from '@jest/globals';
import { prismaMock } from '../setup';
import { getNextMatch, getNextMatchHistory, updateNextMatch, setActiveNextMatch } from '../../src/utils/nextMatch';

describe('NextMatch API', () => {
  const testMatch = {
    id: '1',
    matchId: '1',
    ticketLink: 'https://tickets.com',
    moreInfoContent: 'Test info',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    match: {
      id: '1',
      date: new Date(),
      competition: 'Test League',
      homeTeam: 'Home',
      awayTeam: 'Away',
      venue: 'Test Stadium',
      played: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  test('should get active next match', async () => {
    prismaMock.nextMatch.findFirst.mockResolvedValue(testMatch);
    const match = await getNextMatch();
    expect(match).toEqual(testMatch);
  });

  test('should get next match history', async () => {
    const historyEntry = {
      ...testMatch,
      activatedAt: new Date(),
      deactivatedAt: new Date()
    };
    prismaMock.nextMatchHistory.findMany.mockResolvedValue([historyEntry]);
    const history = await getNextMatchHistory();
    expect(history).toEqual([historyEntry]);
  });

  test('should update next match', async () => {
    const updateData = {
      id: '1',
      ticketLink: 'https://new-tickets.com',
      moreInfoContent: 'Updated info'
    };

    prismaMock.nextMatch.update.mockResolvedValue({
      ...testMatch,
      ...updateData
    });

    const match = await updateNextMatch(updateData);
    expect(match.ticketLink).toBe(updateData.ticketLink);
    expect(match.moreInfoContent).toBe(updateData.moreInfoContent);
  });

  test('should set active next match', async () => {
    prismaMock.$transaction.mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return callback(prismaMock);
      }
      return callback;
    });

    await setActiveNextMatch('1');

    expect(prismaMock.nextMatch.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { active: true }
    });
  });
});
