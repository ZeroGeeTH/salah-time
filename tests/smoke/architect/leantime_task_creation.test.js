const { test, expect } = require('@playwright/test');

// Assumption: The LEANTIME_URL, ARCHITECT_USERNAME, and ARCHITECT_PASSWORD env variables are set in CI.
test.describe('Architect Mode: Leantime Task Creation', () => {
  test('should allow architect to create a new task', async ({ page }) => {
    const BASE_URL = process.env.LEANTIME_URL || 'http://localhost:8080';
    const USERNAME = process.env.ARCHITECT_USERNAME || 'architect';
    const PASSWORD = process.env.ARCHITECT_PASSWORD || 'password';
    const PROJECT_NAME = 'Architect Smoke Test ' + Date.now();
    const TASK_TITLE = 'Architect Smoke Task ' + Date.now();

    // Login as architect
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name=email]', USERNAME);
    await page.fill('input[name=password]', PASSWORD);
    await page.click('button[type=submit]');

    // Wait for dashboard to load
    await page.waitForSelector('a[href*="/projects/add"]', { timeout: 10000 });

    // Create a new project so we have a project to add tasks to (if needed)
    await page.click('a[href*="/projects/add"]');
    await page.fill('input[name=title]', PROJECT_NAME);
    await page.fill('textarea[name=description]', 'Project for smoke testing architect task creation');
    await page.click('button[type=submit]');

    // Wait for project board page
    await page.waitForURL(new RegExp(`/projects/view/[0-9]+`), { timeout: 8000 });

    // Go to Tasks or Backlog for the created project
    await page.click('a:has-text("Tasks")');
    await page.waitForURL(/\/projects\/tasks\/[0-9]+/);

    // Click Add Task/New Task button
    await page.click('button:has-text("New Task"), button:has-text("Add Task")'); // handle various Leantime versions

    // Fill out the form
    await page.fill('input[name=title]', TASK_TITLE);
    await page.fill('textarea[name=description]', 'Smoke test task');

    // Submit
    await page.click('button[type=submit], button:has-text("Save")');

    // Assert that the task appears
    await page.waitForSelector(`text=${TASK_TITLE}`, { timeout: 8000 });
    const found = await page.isVisible(`text=${TASK_TITLE}`);
    expect(found).toBeTruthy();
  });
});
