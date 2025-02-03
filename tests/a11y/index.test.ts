import { test, expect } from '@jest/globals';
import puppeteer from 'puppeteer';
import axe from 'axe-core';

const pages = [
  '/',
  '/news',
  '/team/squad',
  '/matches/schedule',
  '/matches/table',
  '/fanclubs',
  '/about',
  '/contact',
  '/membership'
];

describe('Accessibility Tests', () => {
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
  });

  afterEach(async () => {
    await page.close();
  });

  test.each(pages)('Page %s should not have any accessibility violations', async (route) => {
    await page.goto(`http://localhost:4321${route}`);
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
  });
});