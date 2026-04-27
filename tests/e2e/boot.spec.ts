import { expect, test } from '@playwright/test';

test('DOM menu flow reaches gameplay', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('/');
  await expect(page.locator('.jds-menu-root [data-screen="start"]')).toBeVisible();
  await page.screenshot({ path: 'test-results/phase1-dom-start-1440x900.png', fullPage: true });

  await page.keyboard.press('Enter');
  await expect(page.locator('.jds-menu-root [data-screen="stage-select"]')).toBeVisible();
  await page.screenshot({ path: 'test-results/phase1-dom-stage-1440x900.png', fullPage: true });

  await page.keyboard.press('Enter');
  await expect(page.locator('.jds-menu-root [data-screen="weapon-select"]')).toBeVisible();
  await page.keyboard.press('Digit2');
  await expect(page.locator('.jds-menu-root [data-screen="weapon-select"]')).toBeVisible();
  await expect(page.locator('.jds-file.active')).toContainText('C_Cpp.c');
  await page.screenshot({ path: 'test-results/phase1-dom-weapon-1440x900.png', fullPage: true });

  await page.keyboard.press('Enter');
  await expect(page.locator('.jds-menu-root')).toHaveCount(0);
  await expect(page.locator('canvas')).toBeVisible();
});
