import type { AdminJourney, AdminFeature, AdminMetrics } from '../types/admin';
import { getNews } from './news';
import { getMatches } from './matches';
import { getPlayers } from './team';
import { getFanclubs } from './fanclubs';

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const [news, matches, players, fanclubs] = await Promise.all([
    getNews(),
    getMatches(),
    getPlayers(),
    getFanclubs()
  ]);

  return {
    totalNews: news.length,
    totalMatches: matches.length,
    totalPlayers: players.length,
    totalFanclubs: fanclubs.length,
    lastUpdate: new Date().toISOString()
  };
}

export async function getAdminJourneys(): Promise<AdminJourney[]> {
  // This would typically come from a monitoring system
  return [
    {
      id: 'content-management',
      name: 'Content Management Journey',
      description: 'Create and manage news articles',
      steps: [
        { name: 'Login', status: 'success' },
        { name: 'Create Article', status: 'success' },
        { name: 'Upload Images', status: 'success' },
        { name: 'Publish', status: 'success' }
      ],
      lastRun: new Date().toISOString(),
      status: 'success'
    },
    // Add other journeys...
  ];
}

export async function getAdminFeatures(): Promise<AdminFeature[]> {
  return [
    {
      id: 'news-management',
      name: 'News Management',
      description: 'Create and manage news articles',
      status: 'active',
      lastChecked: new Date().toISOString()
    },
    // Add other features...
  ];
}