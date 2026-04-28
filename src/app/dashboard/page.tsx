"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/src/types/habits";
import { Session } from "@/src/types/auth";
import {
	getHabitsByUser,
	saveHabitsForUser,
	clearSession,
} from "@/src/lib/storage";
import HabitCard from "@/src/components/habits/HabitCard";
import HabitForm from "@/src/components/habits/HabitForm";
import HabitList from "@/src/components/habits/HabitList";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";

function Dashboard({ session }: { session: Session }) {
	const router = useRouter();
	const [habits, setHabits] = useState<Habit[]>(() =>
		getHabitsByUser(session.userId),
	);
	const [showForm, setShowForm] = useState(false);
	const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

	function persistHabits(updated: Habit[]) {
		saveHabitsForUser(session.userId, updated);
	}

	function handleSave(habit: Habit) {
		let updated: Habit[];

		if (editingHabit) {
			updated = habits.map((h) => (h.id === habit.id ? habit : h));
		} else {
			updated = [...habits, habit];
		}

		setHabits(updated);
		persistHabits(updated);
		setShowForm(false);
		setEditingHabit(null);
	}

	function handleEdit(habit: Habit) {
		setEditingHabit(habit);
		setShowForm(true);
	}

	function handleDelete(habitId: string) {
		const updated = habits.filter((h) => h.id !== habitId);
		setHabits(updated);
		persistHabits(updated);
	}

	function handleToggleComplete(updatedHabit: Habit) {
		const updated = habits.map((h) =>
			h.id === updatedHabit.id ? updatedHabit : h,
		);
		setHabits(updated);
		persistHabits(updated);
	}

	function handleLogout() {
		clearSession();
		router.push("/login");
	}

	function handleCreateClick() {
		setEditingHabit(null);
		setShowForm(true);
	}

	function handleCancel() {
		setShowForm(false);
		setEditingHabit(null);
	}

	return (
		<div
			data-testid="dashboard-page"
			className="min-h-screen bg-black px-4 py-8"
		>
			<div className="mx-auto max-w-lg">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-white">My Habits</h1>
						<p className="mt-1 text-sm text-white/40">{session.email}</p>
					</div>
					<button
						type="button"
						data-testid="auth-logout-button"
						onClick={handleLogout}
						className="rounded-md border border-[#C2410C]/60 px-4 py-2 text-sm text-[#C2410C] transition hover:bg-[#FFF7ED] active:bg-[#FFF7ED]"
					>
						Log out
					</button>
				</div>

				{/* Create button */}
				{!showForm && (
					<button
						type="button"
						data-testid="create-habit-button"
						onClick={handleCreateClick}
						className="mb-6 w-full rounded-xl border border-dashed border-[#C2410C]/70 py-4 text-sm text-[#C2410C] transition hover:border-[#9A3412] hover:text-[#9A3412] active:border-[#9A3412] active:text-[#9A3412]"
					>
						+ New Habit
					</button>
				)}

				{/* Habit form */}
				{showForm && (
					<div className="mb-6">
						<HabitForm
							userId={session.userId}
							existingHabit={editingHabit ?? undefined}
							onSave={handleSave}
							onCancel={handleCancel}
						/>
					</div>
				)}

				{/* Habit list */}
				<HabitList
					habits={habits}
					showForm={showForm}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onToggleComplete={handleToggleComplete}
				/>
			</div>
		</div>
	);
}

export default function DashboardPage() {
	return (
		<ProtectedRoute>
			{(session) => <Dashboard session={session} />}
		</ProtectedRoute>
	);
}
