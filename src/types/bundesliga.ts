export interface BundesligaTeam {
  teamInfoId: number;
  teamName: string;
  shortName: string;
  teamIconUrl: string;
  points: number;
  goals: number;
  opponentGoals: number;
  matches: number;
  won: number;
  lost: number;
  draw: number;
  goalDiff: number;
  position: number;
}

export interface PlayerStats {
  name: string;
  team: string;
  goals: number;
  matches: number;
  goalsPerMatch: number;
}

export interface TeamStats {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  winRate: number;
  goalDifference: number;
}