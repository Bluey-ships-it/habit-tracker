import { Habit } from "../types/habits";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
	const exists = habit.completions.includes(date);

	const updatedCompletions = exists
		? habit.completions.filter((d) => d !== date)
		: [...habit.completions, date];

	const unique = [...new Set(updatedCompletions)];

	return {
		...habit,
		completions: unique,
	};
}
