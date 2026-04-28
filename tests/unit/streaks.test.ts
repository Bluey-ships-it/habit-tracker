import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "../../src/lib/streaks";

describe("calculateCurrentStreak", () => {
	it("returns 0 when completions is empty", () => {
		expect(calculateCurrentStreak([])).toBe(0);
	});

	it("returns 0 when today is not completed", () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStr = yesterday.toISOString().split("T")[0];

		expect(calculateCurrentStreak([yesterdayStr])).toBe(0);
	});

	it("returns the correct streak for consecutive completed days", () => {
		const today = new Date();
		const yesterday = new Date();
		const twoDaysAgo = new Date();

		yesterday.setDate(today.getDate() - 1);
		twoDaysAgo.setDate(today.getDate() - 2);

		const todayStr = today.toISOString().split("T")[0];
		const yesterdayStr = yesterday.toISOString().split("T")[0];
		const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

		expect(calculateCurrentStreak([todayStr])).toBe(1);
		expect(calculateCurrentStreak([todayStr, yesterdayStr])).toBe(2);
		expect(calculateCurrentStreak([todayStr, yesterdayStr, twoDaysAgoStr])).toBe(
			3,
		);
	});

	it("ignores duplicate completion dates", () => {
		const today = new Date().toISOString().split("T")[0];

		expect(calculateCurrentStreak([today, today, today])).toBe(1);
	});

	it("breaks the streak when a calendar day is missing", () => {
		const today = new Date();
		const twoDaysAgo = new Date();

		twoDaysAgo.setDate(today.getDate() - 2);

		const todayStr = today.toISOString().split("T")[0];
		const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

		// yesterday is missing - streak should break at 1
		expect(calculateCurrentStreak([todayStr, twoDaysAgoStr])).toBe(1);
	});
});
