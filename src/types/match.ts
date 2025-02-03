export interface NextMatch {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  ticketLink: string;
  moreInfoContent: string;
  created_at?: string;
  updated_at?: string;
  active?: boolean;
}

export interface Match {
  id?: string;
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  venue: string;
  played: boolean;
  created_at?: string;
  updated_at?: string;
}