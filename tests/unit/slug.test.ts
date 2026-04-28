import { describe, it, expect } from "vitest";
import { getHabitSlug } from "../../src/lib/slug";

describe("getHabitSlug", () => {
	it("returns lowercase hyphenated slug for a basic habit name", () => {
		expect(getHabitSlug("Drink Water")).toBe("drink-water");
		expect(getHabitSlug("Read Books")).toBe("read-books");
	});

	it("trims outer spaces and collapses repeated internal spaces", () => {
		expect(getHabitSlug("  Drink Water  ")).toBe("drink-water");
		expect(getHabitSlug("Read  Books")).toBe("read-books");
		expect(getHabitSlug("  Wake   Up  ")).toBe("wake-up");
	});

	it("removes non alphanumeric characters except hyphens", () => {
		expect(getHabitSlug("Wake Up!")).toBe("wake-up");
		expect(getHabitSlug("Eat & Drink")).toBe("eat-drink");
		expect(getHabitSlug("Run 5km!")).toBe("run-5km");
	});
});
