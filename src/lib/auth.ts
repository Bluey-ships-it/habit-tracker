import { v4 as uuidv4 } from "uuid";
import { User, Session } from "../types/auth";
import { getUsers, saveSession,saveUsers } from "./storage";

export type AuthResult =
	| { success: true; session: Session }
	| { success: false; error: string };

export function signUp(email: string, password: string): AuthResult {
	const users = getUsers();

	const duplicate = users.find((u) => u.email === email);

	if (duplicate) {
		return {
			success: false,
			error: "User already exists",
		};
	}

	const newUser: User = {
		id: uuidv4(),
		email,
		password,
		createdAt: new Date().toISOString(),
	};

	saveUsers([...users, newUser]);

	const session: Session = { userId: newUser.id, email: newUser.email };
	saveSession(session);

	return { success: true, session };
}

export function logIn(email: string, password: string): AuthResult {
	const users = getUsers();

	const match = users.find((u) => u.email === email && u.password === password);

	if (!match) {
		return {
			success: false,
			error: "Invalid email or password",
		};
	}

	const session: Session = { userId: match.id, email: match.email };
	saveSession(session);

	return { success: true, session };
}
