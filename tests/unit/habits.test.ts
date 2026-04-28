import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";
import { Habit } from "../../src/types/habits";

const baseHabit: Habit = {
	id: "habit-1",
	userId: "user-1",
	name: "Drink Water",
	description: "Stay hydrated",
	frequency: "daily",
	createdAt: "2026-01-01T00:00:00.000Z",
	completions: [],
};

describe("toggleHabitCompletion", () => {
	it("adds a completion date when the date is not present", () => {
		const result = toggleHabitCompletion(baseHabit, "2026-04-26");
		expect(result.completions).toContain("2026-04-26");
	});

	it("removes a completion date when the date already exists", () => {
		const habitWithCompletion: Habit = {
			...baseHabit,
			completions: ["2026-04-26"],
		};
		const result = toggleHabitCompletion(habitWithCompletion, "2026-04-26");
		expect(result.completions).not.toContain("2026-04-26");
	});

	it("does not mutate the original habit object", () => {
		const original: Habit = {
			...baseHabit,
			completions: [],
		};
		const originalCompletionsCopy = [...original.completions];
		toggleHabitCompletion(original, "2026-04-26");

		expect(original.completions).toEqual(originalCompletionsCopy);
	});

	it("does not return duplicate completion dates", () => {
		const habitWithDuplicates: Habit = {
			...baseHabit,
			completions: ["2026-04-26", "2026-04-26"],
		};
		const result = toggleHabitCompletion(habitWithDuplicates, "2026-04-25");
		const uniqueDates = [...new Set(result.completions)];
		expect(result.completions).toEqual(uniqueDates);
	});
});
