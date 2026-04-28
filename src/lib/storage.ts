import { User,Session } from "../types/auth";
import { Habit } from "../types/habits";
import { STORAGE_KEYS } from "./constants";

// Users

export function getUsers(): User[] {
	const raw = localStorage.getItem(STORAGE_KEYS.USERS);
	return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
	localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Session

export function getSession(): Session | null {
	const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
	return raw ? JSON.parse(raw) : null;
}

export function saveSession(session: Session): void {
	localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
	localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Habits
export function getAllHabits(): Habit[] {
	const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
	return raw ? JSON.parse(raw) : [];
}

export function getHabitsByUser(userId: string): Habit[] {
	return getAllHabits().filter((h) => h.userId === userId);
}

export function saveHabitsForUser(userId: string, habits: Habit[]): void {
	const all = getAllHabits();
	const others = all.filter((h) => h.userId !== userId);
	const merged = [...others, ...habits];
	localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(merged));
}
