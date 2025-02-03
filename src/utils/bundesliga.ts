import type { BundesligaTeam, PlayerStats, TeamStats } from '../types/bundesliga';

function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? year.toString() : (year - 1).toString();
}

export async function getBundesligaTable(): Promise<BundesligaTeam[]> {
  try {
    const season = getCurrentSeason();
    const response = await fetch(`https://api.openligadb.de/getbltable/bl1/${season}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((team: BundesligaTeam, index: number) => ({
      ...team,
      position: index + 1
    }));
  } catch (error) {
    console.error('Error fetching Bundesliga table:', error);
    return [];
  }
}

export async function getTopScorers(): Promise<PlayerStats[]> {
  try {
    const season = getCurrentSeason();
    const [scorersResponse, matchesResponse, teamsResponse] = await Promise.all([
      fetch(`https://api.openligadb.de/getgoalgetters/bl1/${season}`),
      fetch(`https://api.openligadb.de/getmatchdata/bl1/${season}`),
      fetch(`https://api.openligadb.de/getavailableteams/bl1/${season}`)
    ]);
    
    if (!scorersResponse.ok || !matchesResponse.ok || !teamsResponse.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const allScorers = await scorersResponse.json();
    const matches = await matchesResponse.json();
    const teams = await teamsResponse.json();

    // Create a map of team matches
    const teamMatches = new Map();
    teams.forEach((team: any) => {
      const teamId = team.teamId;
      const matchCount = matches.filter((match: any) => 
        match.team1.teamId === teamId || match.team2.teamId === teamId
      ).length;
      teamMatches.set(teamId, matchCount);
    });

    // Map team IDs to team names
    const teamNames = new Map(teams.map((team: any) => [team.teamId, team.teamName]));

    // Process all scorers
    const processedScorers = allScorers
      .map((scorer: any) => {
        const teamMatchCount = teamMatches.get(scorer.teamId) || 0;
        return {
          name: scorer.goalGetterName,
          team: teamNames.get(scorer.teamId) || 'Unknown Team',
          goals: scorer.goalCount,
          matches: teamMatchCount,
          goalsPerMatch: teamMatchCount > 0 ? scorer.goalCount / teamMatchCount : 0
        };
      })
      .sort((a: PlayerStats, b: PlayerStats) => b.goals - a.goals);

    return processedScorers;
  } catch (error) {
    console.error('Error fetching scorers:', error);
    return [];
  }
}