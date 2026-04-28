"use client";

import { useState } from "react";
import { Habit } from "@/src/types/habits";
import { getHabitSlug } from "@/src/lib/slug";
import { calculateCurrentStreak } from "@/src/lib/streaks";
import { toggleHabitCompletion } from "@/src/lib/habits";

type Props = {
	habit: Habit;
	onEdit: (habit: Habit) => void;
	onDelete: (habitId: string) => void;
	onToggleComplete: (habit: Habit) => void;
};

export default function HabitCard({
	habit,
	onEdit,
	onDelete,
	onToggleComplete,
}: Props) {
	const [confirmingDelete, setConfirmingDelete] = useState(false);

	const slug = getHabitSlug(habit.name);
	const today = new Date().toISOString().split("T")[0];
	const isCompletedToday = habit.completions.includes(today);
	const streak = calculateCurrentStreak(habit.completions);

	function handleToggle() {
		const updated = toggleHabitCompletion(habit, today);
		onToggleComplete(updated);
	}

	function handleDeleteClick() {
		setConfirmingDelete(true);
	}

	function handleConfirmDelete() {
		onDelete(habit.id);
		setConfirmingDelete(false);
	}

	function handleCancelDelete() {
		setConfirmingDelete(false);
	}

	return (
		<div
			data-testid={`habit-card-${slug}`}
			className={`rounded-xl border p-5 transition ${
				isCompletedToday
					? "border-[#C2410C]/50 bg-[#FFF7ED]/10"
					: "border-white/10 bg-white/5"
			}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1">
					<h3 className="font-semibold text-white">{habit.name}</h3>
					{habit.description && (
						<p className="mt-1 text-sm text-white/50">{habit.description}</p>
					)}

					<div className="mt-3 flex items-center gap-2">
						<span className="text-xs text-white/40">Streak</span>
						<span
							data-testid={`habit-streak-${slug}`}
							className="text-sm font-bold text-white"
						>
							{streak} {streak === 1 ? "day" : "days"}
						</span>
					</div>
				</div>

				<button
					type="button"
					data-testid={`habit-complete-${slug}`}
					onClick={handleToggle}
					aria-label={isCompletedToday ? "Mark incomplete" : "Mark complete"}
					className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${
						isCompletedToday
							? "border-[#C2410C] bg-[#C2410C] text-white"
							: "border-[#C2410C]/60 bg-transparent text-transparent"
					}`}
				>
					✓
				</button>
			</div>

			<div className="mt-4 flex items-center gap-2">
				<button
					type="button"
					data-testid={`habit-edit-${slug}`}
					onClick={() => onEdit(habit)}
					className="rounded-md border border-[#C2410C]/60 px-3 py-1 text-xs text-[#C2410C] transition hover:bg-[#FFF7ED] active:bg-[#FFF7ED]"
				>
					Edit
				</button>
				<button
					type="button"
					data-testid={`habit-delete-${slug}`}
					onClick={handleDeleteClick}
					className="rounded-md border border-red-500/20 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
				>
					Delete
				</button>
			</div>

			{confirmingDelete && (
				<div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
					<p className="mb-3 text-sm text-red-300">
						Delete <strong>{habit.name}</strong>? This cannot be undone.
					</p>
					<div className="flex gap-2">
						<button
							type="button"
							data-testid="confirm-delete-button"
							onClick={handleConfirmDelete}
							className="rounded-md bg-red-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600"
						>
							Yes, delete
						</button>
						<button
							type="button"
							onClick={handleCancelDelete}
							className="rounded-md border border-white/10 px-4 py-1.5 text-sm text-white/60 transition hover:bg-white/5"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
