export function calculateCurrentStreak(
	completions: string[],
	today?: string,
): number {
	const todayDate = today ?? new Date().toISOString().split("T")[0];

	// Deduplicate
	const unique = [...new Set(completions)];

	// Sort ascending
	unique.sort();

	// If today is not completed, streak is 0
	if (!unique.includes(todayDate)) {
		return 0;
	}

	// Count consecutive days backwards from today
	let streak = 0;
	let current = new Date(todayDate);

	while (true) {
		const dateStr = current.toISOString().split("T")[0];

		if (unique.includes(dateStr)) {
			streak++;
			// Move one day back
			current.setDate(current.getDate() - 1);
		} else {
			break;
		}
	}

	return streak;
}
