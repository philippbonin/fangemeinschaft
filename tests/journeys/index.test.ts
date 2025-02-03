import { test, expect } from '@jest/globals';
import puppeteer from 'puppeteer';

// Common user journeys to test
const journeys = {
  // Fan looking for match information
  matchInfoJourney: [
    { path: '/', action: 'visit' },
    { selector: 'a[href="/matches/schedule"]', action: 'click' },
    { selector: '.next-matches', action: 'exists' },
    { selector: 'a[href^="/matches/"]', action: 'click' },
    { selector: '.ticket-button', action: 'exists' }
  ],

  // Fan wanting to join a fanclub
  fanclubJourney: [
    { path: '/', action: 'visit' },
    { selector: 'a[href="/fanclubs"]', action: 'click' },
    { selector: '.fanclub-list', action: 'exists' },
    { selector: 'a[href="/membership"]', action: 'click' },
    { selector: 'form[action="/api/membership"]', action: 'exists' }
  ],

  // Fan reading news
  newsJourney: [
    { path: '/', action: 'visit' },
    { selector: 'a[href="/news"]', action: 'click' },
    { selector: '.news-grid', action: 'exists' },
    { selector: 'article a', action: 'click' },
    { selector: '.news-content', action: 'exists' }
  ],

  // Fan checking team information
  teamJourney: [
    { path: '/', action: 'visit' },
    { selector: 'a[href="/team/squad"]', action: 'click' },
    { selector: '.squad-grid', action: 'exists' },
    { selector: 'a[href="/team/coaches"]', action: 'click' },
    { selector: '.coaches-grid', action: 'exists' }
  ],

  // Fan using chat support
  supportJourney: [
    { path: '/', action: 'visit' },
    { selector: 'button[aria-label="Chat öffnen"]', action: 'click' },
    { selector: '#chat-window', action: 'exists' },
    { selector: 'input[aria-label="Nachricht eingeben"]', action: 'type', value: 'Hallo' },
    { selector: 'button[aria-label="Nachricht senden"]', action: 'click' },
    { selector: '.message-sent', action: 'exists' }
  ]
};

describe('Customer Journeys', () => {
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
  });

  afterEach(async () => {
    await page.close();
  });

  // Test each journey
  Object.entries(journeys).forEach(([journeyName, steps]) => {
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

          case 'exists':
            await page.waitForSelector(step.selector);
            const element = await page.$(step.selector);
            expect(element).not.toBeNull();
            break;

          case 'type':
            await page.waitForSelector(step.selector);
            await page.type(step.selector, step.value);
            break;
        }
      }
    });
  });

  // Test accessibility for each page in journeys
  test('all pages in journeys should be accessible', async () => {
    const uniquePaths = new Set(
      Object.values(journeys)
        .flat()
        .filter(step => step.action === 'visit')
        .map(step => step.path)
    );

    for (const path of uniquePaths) {
      await page.goto(`http://localhost:4321${path}`);
      await page.addScriptTag({ path: require.resolve('axe-core') });

      const results = await page.evaluate(() => {
        return new Promise(resolve => {
          axe.run((err, results) => {
            if (err) throw err;
            resolve(results);
          });
        });
      });

      expect(results.violations).toEqual([]);
    }
  });
});