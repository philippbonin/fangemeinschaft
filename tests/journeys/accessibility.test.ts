import { test, expect } from '@jest/globals';
import puppeteer from 'puppeteer';
import axe from 'axe-core';

// Define critical user paths based on personas
const criticalPaths = [
  // Casual Fan Path
  [
    '/',
    '/matches/schedule',
    '/news'
  ],

  // Dedicated Fan Path
  [
    '/fanclubs',
    '/team/squad',
    '/matches/table'
  ],

  // New Fan Path
  [
    '/about',
    '/membership',
    '/about/club'
  ],

  // Season Ticket Holder Path
  [
    '/matches/schedule',
    '/matches/stats',
    '/team/squad'
  ]
];

describe('Accessibility on Critical User Paths', () => {
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

  // Test each critical path
  criticalPaths.forEach((path, index) => {
    test(`Critical Path ${index + 1} should be accessible`, async () => {
      for (const route of path) {
        await page.goto(`http://localhost:4321${route}`);
        await page.addScriptTag({ path: require.resolve('axe-core') });

        const results = await page.evaluate(() => {
          return new Promise(resolve => {
            axe.run({
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
              }
            }, (err, results) => {
              if (err) throw err;
              resolve(results);
            });
          });
        });

        expect(results.violations).toEqual([]);
      }
    });
  });

  // Test keyboard navigation
  test('Critical paths should be navigable by keyboard', async () => {
    for (const path of criticalPaths[0]) { // Test first path as example
      await page.goto(`http://localhost:4321${path}`);
      
      // Press Tab key multiple times to navigate
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        
        // Check if some element has focus
        const focusedElement = await page.evaluate(() => {
          const active = document.activeElement;
          return {
            tag: active.tagName,
            hasVisibleOutline: window.getComputedStyle(active).outlineStyle !== 'none'
          };
        });

        expect(focusedElement.hasVisibleOutline).toBe(true);
      }
    }
  });

  // Test screen reader compatibility
  test('Critical elements should have proper ARIA labels', async () => {
    for (const path of criticalPaths[0]) {
      await page.goto(`http://localhost:4321${path}`);

      const ariaLabels = await page.evaluate(() => {
        const elements = document.querySelectorAll('[aria-label], [aria-describedby], [role]');
        return Array.from(elements).map(el => ({
          tag: el.tagName,
          ariaLabel: el.getAttribute('aria-label'),
          ariaDescribedby: el.getAttribute('aria-describedby'),
          role: el.getAttribute('role')
        }));
      });

      expect(ariaLabels.length).toBeGreaterThan(0);
      ariaLabels.forEach(el => {
        if (el.ariaLabel) {
          expect(el.ariaLabel.length).toBeGreaterThan(0);
        }
      });
    }
  });
});