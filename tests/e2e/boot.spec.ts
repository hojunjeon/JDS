import { expect, test } from '@playwright/test';

test('boots the menu and enters the game', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  await expect(page.locator('canvas')).toBeVisible();
});
