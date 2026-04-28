import { test, expect, Page } from "@playwright/test";

// Helper - seed localStorage from inside the browser
async function seedSession(page: Page) {
	await page.evaluate(() => {
		const user = {
			id: "user-1",
			email: "test@example.com",
			password: "password123",
			createdAt: new Date().toISOString(),
		};
		const session = { userId: "user-1", email: "test@example.com" };
		localStorage.setItem("habit-tracker-users", JSON.stringify([user]));
		localStorage.setItem("habit-tracker-session", JSON.stringify(session));
	});
}

// Helper - seed a habit into localStorage
async function seedHabit(page: Page) {
	await page.evaluate(() => {
		const habit = {
			id: "habit-1",
			userId: "user-1",
			name: "Drink Water",
			description: "Stay hydrated",
			frequency: "daily",
			createdAt: "2026-01-01T00:00:00.000Z",
			completions: [],
		};
		localStorage.setItem("habit-tracker-habits", JSON.stringify([habit]));
	});
}

test.describe("Habit Tracker app", () => {
	test("shows the splash screen and redirects unauthenticated users to /login", async ({
		page,
	}) => {
		await page.goto("/");

		// Splash screen should be visible immediately
		await expect(page.getByTestId("splash-screen")).toBeVisible();

		// Wait for redirect to login
		await page.waitForURL("/login");
		expect(page.url()).toContain("/login");
	});

	test("redirects authenticated users from / to /dashboard", async ({ page }) => {
		await page.goto("/");
		await seedSession(page);
		await page.goto("/");

		await page.waitForURL("/dashboard");
		expect(page.url()).toContain("/dashboard");
	});

	test("prevents unauthenticated access to /dashboard", async ({ page }) => {
		await page.goto("/dashboard");
		await page.waitForURL("/login");
		expect(page.url()).toContain("/login");
	});

	test("signs up a new user and lands on the dashboard", async ({ page }) => {
		await page.goto("/signup");

		await page.getByTestId("auth-signup-email").fill("newuser@example.com");
		await page.getByTestId("auth-signup-password").fill("password123");
		await page.getByTestId("auth-signup-submit").click();

		await page.waitForURL("/dashboard");
		await expect(page.getByTestId("dashboard-page")).toBeVisible();
	});

	test("logs in an existing user and loads only that user's habits", async ({
		page,
	}) => {
		// Seed user and a habit belonging to user-1
		await page.goto("/");
		await page.evaluate(() => {
			const users = [
				{
					id: "user-1",
					email: "test@example.com",
					password: "password123",
					createdAt: new Date().toISOString(),
				},
				{
					id: "user-2",
					email: "other@example.com",
					password: "password123",
					createdAt: new Date().toISOString(),
				},
			];
			const habits = [
				{
					id: "habit-1",
					userId: "user-1",
					name: "Drink Water",
					description: "",
					frequency: "daily",
					createdAt: new Date().toISOString(),
					completions: [],
				},
				{
					id: "habit-2",
					userId: "user-2",
					name: "Read Books",
					description: "",
					frequency: "daily",
					createdAt: new Date().toISOString(),
					completions: [],
				},
			];
			localStorage.setItem("habit-tracker-users", JSON.stringify(users));
			localStorage.setItem("habit-tracker-habits", JSON.stringify(habits));
		});

		await page.goto("/login");
		await page.getByTestId("auth-login-email").fill("test@example.com");
		await page.getByTestId("auth-login-password").fill("password123");
		await page.getByTestId("auth-login-submit").click();

		await page.waitForURL("/dashboard");

		// user-1's habit should be visible
		await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

		// user-2's habit should NOT be visible
		await expect(page.getByTestId("habit-card-read-books")).not.toBeVisible();
	});

	test("creates a habit from the dashboard", async ({ page }) => {
		await page.goto("/");
		await seedSession(page);
		await page.goto("/dashboard");

		await expect(page.getByTestId("dashboard-page")).toBeVisible();

		await page.getByTestId("create-habit-button").click();
		await expect(page.getByTestId("habit-form")).toBeVisible();

		await page.getByTestId("habit-name-input").fill("Drink Water");
		await page.getByTestId("habit-description-input").fill("Stay hydrated");
		await page.getByTestId("habit-save-button").click();

		await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
	});

	test("completes a habit for today and updates the streak", async ({ page }) => {
		await page.goto("/");
		await seedSession(page);
		await seedHabit(page);
		await page.goto("/dashboard");

		await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

		// Streak starts at 0
		await expect(page.getByTestId("habit-streak-drink-water")).toContainText("0");

		// Complete the habit
		await page.getByTestId("habit-complete-drink-water").click();

		// Streak should now be 1
		await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
	});

	test("persists session and habits after page reload", async ({ page }) => {
		await page.goto("/");
		await seedSession(page);
		await seedHabit(page);
		await page.goto("/dashboard");

		await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();

		// Reload the page
		await page.reload();

		// Should still be on dashboard with habit visible
		await expect(page.getByTestId("dashboard-page")).toBeVisible();
		await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
	});

	test("logs out and redirects to /login", async ({ page }) => {
		await page.goto("/");
		await seedSession(page);
		await page.goto("/dashboard");

		await expect(page.getByTestId("dashboard-page")).toBeVisible();

		await page.getByTestId("auth-logout-button").click();

		await page.waitForURL("/login");
		expect(page.url()).toContain("/login");
	});

test("loads the cached app shell when offline after the app has been loaded once", async ({
	page,
	context,
}) => {
	await page.goto("/");
	await seedSession(page);
	await page.goto("/dashboard");
	await expect(page.getByTestId("dashboard-page")).toBeVisible();

	// Give service worker time to cache
	await page.waitForTimeout(2000);

	// Go offline
	await context.setOffline(true);

	// Reload while offline
	try {
		await page.reload({ timeout: 8000 });
		await page.waitForLoadState("domcontentloaded", { timeout: 8000 });
	} catch {
		// Acceptable offline
	}

	// Should not end up on browser error page
	await expect
		.poll(() => page.url(), { timeout: 5000 })
		.not.toContain("chrome-error://");

	// App shell should still be renderable from cache
	await expect(page.locator("body")).toBeVisible();

	await context.setOffline(false);
});
});
