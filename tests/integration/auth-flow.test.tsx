import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../src/components/auth/LoginForm";
import SignupForm from "../../src/components/auth/SignupForm";

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockRouter = {
	push: mockPush,
	replace: mockReplace,
};

vi.mock("next/navigation", () => ({
	useRouter: () => mockRouter,
}));

function seedUser(email: string, password: string) {
	const user = {
		id: "test-user-1",
		email,
		password,
		createdAt: new Date().toISOString(),
	};
	localStorage.setItem("habit-tracker-users", JSON.stringify([user]));
}

describe("auth flow", () => {
	beforeEach(() => {
		localStorage.clear();
		mockPush.mockClear();
		mockReplace.mockClear();
	});

	it("submits the signup form and creates a session", async () => {
		const user = userEvent.setup();
		render(<SignupForm />);

		await user.type(screen.getByTestId("auth-signup-email"), "test@example.com");
		await user.type(screen.getByTestId("auth-signup-password"), "password123");
		await user.click(screen.getByTestId("auth-signup-submit"));

		await waitFor(() => {
			const session = JSON.parse(
				localStorage.getItem("habit-tracker-session") ?? "null",
			);
			expect(session).not.toBeNull();
			expect(session.email).toBe("test@example.com");
		});

		expect(mockReplace).toHaveBeenCalledWith("/dashboard");
	});

	it("shows an error for duplicate signup email", async () => {
		seedUser("test@example.com", "password123");
		const user = userEvent.setup();
		render(<SignupForm />);

		await user.type(screen.getByTestId("auth-signup-email"), "test@example.com");
		await user.type(screen.getByTestId("auth-signup-password"), "password123");
		await user.click(screen.getByTestId("auth-signup-submit"));

		await waitFor(() => {
			expect(screen.getByText("User already exists")).toBeInTheDocument();
		});
	});

	it("submits the login form and stores the active session", async () => {
		seedUser("test@example.com", "password123");
		const user = userEvent.setup();
		render(<LoginForm />);

		await user.type(screen.getByTestId("auth-login-email"), "test@example.com");
		await user.type(screen.getByTestId("auth-login-password"), "password123");
		await user.click(screen.getByTestId("auth-login-submit"));

		await waitFor(() => {
			const session = JSON.parse(
				localStorage.getItem("habit-tracker-session") ?? "null",
			);
			expect(session).not.toBeNull();
			expect(session.email).toBe("test@example.com");
		});

		expect(mockReplace).toHaveBeenCalledWith("/dashboard");
	});

	it("shows an error for invalid login credentials", async () => {
		seedUser("test@example.com", "password123");
		const user = userEvent.setup();
		render(<LoginForm />);

		await user.type(screen.getByTestId("auth-login-email"), "test@example.com");
		await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
		await user.click(screen.getByTestId("auth-login-submit"));

		await waitFor(() => {
			expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
		});
	});
});
