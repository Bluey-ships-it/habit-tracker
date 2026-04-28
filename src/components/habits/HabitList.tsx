import { Habit } from "@/src/types/habits";
import HabitCard from "./HabitCard";

type Props = {
	habits: Habit[];
	showForm: boolean;
	onEdit: (habit: Habit) => void;
	onDelete: (habitId: string) => void;
	onToggleComplete: (habit: Habit) => void;
};

export default function HabitList({
	habits,
	showForm,
	onEdit,
	onDelete,
	onToggleComplete,
}: Props) {
	if (!showForm && habits.length === 0) {
		return (
			<div
				data-testid="empty-state"
				className="rounded-xl border border-white/10 py-16 text-center"
			>
				<p className="text-white/40">No habits yet.</p>
				<p className="mt-1 text-sm text-white/30">Create one to get started.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{habits.map((habit) => (
				<HabitCard
					key={habit.id}
					habit={habit}
					onEdit={onEdit}
					onDelete={onDelete}
					onToggleComplete={onToggleComplete}
				/>
			))}
		</div>
	);
}
