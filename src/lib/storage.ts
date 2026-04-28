import { User, Session } from "@/src/types/auth";
import { Habit } from "../types/habits";
import { STORAGE_KEYS } from "@/src/lib/constants";

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function getUsers(): User[] {
	if (!isBrowser()) return [];
	const raw = localStorage.getItem(STORAGE_KEYS.USERS);
	return raw ? JSON.parse(raw) : [];
}

export function saveUsers(users: User[]): void {
	if (!isBrowser()) return;
	localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getSession(): Session | null {
	if (!isBrowser()) return null;
	const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
	return raw ? JSON.parse(raw) : null;
}

export function saveSession(session: Session): void {
	if (!isBrowser()) return;
	localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
	if (!isBrowser()) return;
	localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function getAllHabits(): Habit[] {
	if (!isBrowser()) return [];
	const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
	return raw ? JSON.parse(raw) : [];
}

export function getHabitsByUser(userId: string): Habit[] {
	return getAllHabits().filter((h) => h.userId === userId);
}

export function saveHabitsForUser(userId: string, habits: Habit[]): void {
	if (!isBrowser()) return;
	const all = getAllHabits();
	const others = all.filter((h) => h.userId !== userId);
	const merged = [...others, ...habits];
	localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(merged));
}
