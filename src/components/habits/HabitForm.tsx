"use client";

import { useState } from "react";
import { Habit } from "@/src/types/habits";
import { validateHabitName } from "@/src/lib/validators";
import { v4 as uuidv4 } from "uuid";

type Props = {
	userId: string;
	existingHabit?: Habit;
	onSave: (habit: Habit) => void;
	onCancel: () => void;
};

export default function HabitForm({
	userId,
	existingHabit,
	onSave,
	onCancel,
}: Props) {
	const [name, setName] = useState(existingHabit?.name ?? "");
	const [description, setDescription] = useState(
		existingHabit?.description ?? "",
	);
	const [nameError, setNameError] = useState<string | null>(null);

	function handleSave() {
		const validation = validateHabitName(name);

		if (!validation.valid) {
			setNameError(validation.error);
			return;
		}

		setNameError(null);

		const habit: Habit = existingHabit
			? {
					...existingHabit,
					name: validation.value,
					description,
				}
			: {
					id: uuidv4(),
					userId,
					name: validation.value,
					description,
					frequency: "daily",
					createdAt: new Date().toISOString(),
					completions: [],
				};

		onSave(habit);
	}

	return (
		<div
			data-testid="habit-form"
			className="rounded-xl border border-white/10 bg-white/5 p-6"
		>
			<h2 className="mb-6 text-lg font-semibold text-white">
				{existingHabit ? "Edit Habit" : "New Habit"}
			</h2>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="habit-name"
						className="mb-1 block text-sm text-white/70"
					>
						Habit Name <span className="text-red-400">*</span>
					</label>
					<input
						id="habit-name"
						type="text"
						data-testid="habit-name-input"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
						placeholder="e.g. Drink Water"
					/>
					{nameError && (
						<p className="mt-1 text-sm text-red-400">{nameError}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="habit-description"
						className="mb-1 block text-sm text-white/70"
					>
						Description
					</label>
					<input
						id="habit-description"
						type="text"
						data-testid="habit-description-input"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
						placeholder="Optional description"
					/>
				</div>

				<div>
					<label
						htmlFor="habit-frequency"
						className="mb-1 block text-sm text-white/70"
					>
						Frequency
					</label>
					<select
						id="habit-frequency"
						data-testid="habit-frequency-select"
						defaultValue="daily"
						className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
					>
						<option value="daily">Daily</option>
					</select>
				</div>

				<div className="flex gap-3 pt-2">
					<button
						type="button"
						data-testid="habit-save-button"
						onClick={handleSave}
						className="flex-1 rounded-md bg-[#C2410C] py-2 font-semibold text-white transition hover:bg-[#9A3412] active:bg-[#9A3412]"
					>
						{existingHabit ? "Update" : "Save"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 rounded-md border border-[#C2410C]/60 py-2 text-[#C2410C] transition hover:bg-[#FFF7ED] active:bg-[#FFF7ED]"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
