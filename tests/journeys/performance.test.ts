import { test, expect } from '@jest/globals';
import puppeteer from 'puppeteer';

describe('Performance on Critical User Paths', () => {
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
    await page.setCacheEnabled(false);
  });

  afterEach(async () => {
    await page.close();
  });

  const criticalPages = [
    '/',
    '/matches/schedule',
    '/news',
    '/team/squad',
    '/fanclubs'
  ];

  test.each(criticalPages)('Page %s should load within performance budget', async (route) => {
    const client = await page.target().createCDPSession();
    await client.send('Network.enable');
    await client.send('Performance.enable');

    const navigationPromise = page.goto(`http://localhost:4321${route}`);
    
    // Collect performance metrics
    const metrics = await Promise.all([
      navigationPromise,
      page.metrics(),
      client.send('Performance.getMetrics')
    ]);

    const navigationTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(performance.timing))
    );

    // Performance budgets
    const budgets = {
      firstPaint: 1000, // 1s
      firstContentfulPaint: 1500, // 1.5s
      domInteractive: 2000, // 2s
      loadComplete: 3000 // 3s
    };

    // Verify metrics against budgets
    expect(navigationTiming.domInteractive - navigationTiming.navigationStart)
      .toBeLessThan(budgets.domInteractive);
    
    expect(navigationTiming.loadEventEnd - navigationTiming.navigationStart)
      .toBeLessThan(budgets.loadComplete);
  });

  test('Critical interactions should be responsive', async () => {
    await page.goto('http://localhost:4321/');

    // Test menu interaction
    const menuButton = await page.$('button[aria-label="Chat öffnen"]');
    const interactionStart = Date.now();
    await menuButton.click();
    const interactionEnd = Date.now();

    expect(interactionEnd - interactionStart).toBeLessThan(100); // Should respond within 100ms
  });
});