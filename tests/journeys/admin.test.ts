import { test, expect } from '@jest/globals';
import puppeteer from 'puppeteer';

// Admin journeys to test
const adminJourneys = {
  // Content Management Journey
  contentManagementJourney: [
    { path: '/admin/login', action: 'visit' },
    { selector: 'input[name="email"]', action: 'type', value: 'admin@fangemeinschaft.de' },
    { selector: 'input[name="password"]', action: 'type', value: '4rfvVGZ/1984' },
    { selector: 'button[type="submit"]', action: 'click' },
    { path: '/admin/news/create', action: 'visit' },
    { selector: 'input[name="title"]', action: 'type', value: 'Test News' },
    { selector: 'textarea[name="content"]', action: 'type', value: 'Test Content' },
    { selector: 'select[name="category"]', action: 'select', value: 'Team News' },
    { selector: 'form', action: 'submit' },
    { selector: '.success-message', action: 'exists' }
  ],

  // Match Preparation Journey
  matchPreparationJourney: [
    { path: '/admin/matches/create', action: 'visit' },
    { selector: 'input[name="date"]', action: 'type', value: '2025-02-01' },
    { selector: 'input[name="time"]', action: 'type', value: '15:30' },
    { selector: 'input[name="homeTeam"]', action: 'type', value: 'Home Team' },
    { selector: 'input[name="awayTeam"]', action: 'type', value: 'Away Team' },
    { selector: 'select[name="venue"]', action: 'select', value: 'signal-iduna-park' },
    { selector: 'form', action: 'submit' },
    { path: '/admin/formation/create', action: 'visit' },
    { selector: '.formation-editor', action: 'exists' },
    { selector: '.player-list', action: 'exists' },
    { selector: 'button[type="submit"]', action: 'click' },
    { selector: '.success-message', action: 'exists' }
  ],

  // Team Management Journey
  teamManagementJourney: [
    { path: '/admin/team/create', action: 'visit' },
    { selector: 'input[name="name"]', action: 'type', value: 'New Player' },
    { selector: 'input[name="number"]', action: 'type', value: '10' },
    { selector: 'select[name="position"]', action: 'select', value: 'Forward' },
    { selector: 'input[name="image"]', action: 'type', value: 'https://example.com/player.jpg' },
    { selector: 'form', action: 'submit' },
    { selector: '.success-message', action: 'exists' }
  ],

  // Asset Management Journey
  assetManagementJourney: [
    { path: '/admin/assets', action: 'visit' },
    { selector: 'a[href="/admin/assets/upload"]', action: 'click' },
    { selector: 'input[name="name"]', action: 'type', value: 'Test Asset' },
    { selector: 'input[type="file"]', action: 'upload', value: 'test.jpg' },
    { selector: 'form', action: 'submit' },
    { selector: '.success-message', action: 'exists' }
  ],

  // System Monitoring Journey
  systemMonitoringJourney: [
    { path: '/admin/health', action: 'visit' },
    { selector: '.performance-metrics', action: 'exists' },
    { selector: '.accessibility-status', action: 'exists' },
    { selector: '.api-health', action: 'exists' },
    { selector: '.user-journeys', action: 'exists' }
  ],

  // Settings Management Journey
  settingsManagementJourney: [
    { path: '/admin/settings', action: 'visit' },
    { selector: 'input[name="logoUrl"]', action: 'exists' },
    { selector: 'input[name="chatEnabled"]', action: 'exists' },
    { selector: 'button[type="submit"]', action: 'exists' }
  ]
};

describe('Admin Journeys', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Login before each test
    await page.goto('http://localhost:4321/admin/login');
    await page.type('input[name="email"]', 'admin@fangemeinschaft.de');
    await page.type('input[name="password"]', '4rfvVGZ/1984');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  afterEach(async () => {
    await page.close();
  });

  // Test each admin journey
  Object.entries(adminJourneys).forEach(([journeyName, steps]) => {
    test(`${journeyName} should work correctly`, async () => {
      for (const step of steps) {
        switch (step.action) {
          case 'visit':
            await page.goto(`http://localhost:4321${step.path}`);
            break;

          case 'click':
            await page.waitForSelector(step.selector);
            await page.click(step.selector);
            break;

          case 'type':
            await page.waitForSelector(step.selector);
            await page.type(step.selector, step.value);
            break;

          case 'select':
            await page.waitForSelector(step.selector);
            await page.select(step.selector, step.value);
            break;

          case 'upload':
            await page.waitForSelector(step.selector);
            const input = await page.$(step.selector);
            await input.uploadFile(step.value);
            break;

          case 'exists':
            await page.waitForSelector(step.selector);
            const element = await page.$(step.selector);
            expect(element).not.toBeNull();
            break;

          case 'submit':
            await page.waitForSelector(step.selector);
            await page.$eval(step.selector, form => form.submit());
            await page.waitForNavigation();
            break;
        }
      }
    });
  });

  // Test admin-specific security
  test('admin routes should require authentication', async () => {
    // Logout first
    await page.goto('http://localhost:4321/admin/logout');
    
    const adminRoutes = [
      '/admin',
      '/admin/news',
      '/admin/matches',
      '/admin/team',
      '/admin/formation',
      '/admin/assets',
      '/admin/settings'
    ];

    for (const route of adminRoutes) {
      const response = await page.goto(`http://localhost:4321${route}`);
      expect(response.url()).toContain('/admin/login');
    }
  });

  // Test admin session management
  test('admin session should expire after timeout', async () => {
    // Wait for session timeout
    await new Promise(resolve => setTimeout(resolve, 8 * 60 * 60 * 1000 + 1000));
    
    const response = await page.goto('http://localhost:4321/admin');
    expect(response.url()).toContain('/admin/login');
  });
});