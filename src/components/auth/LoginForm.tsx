"use client";
import { getUsers, saveSession } from "@/src/lib/storage";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn } from "@/src/lib/auth";
export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

function handleSubmit(e: React.FormEvent) {
	e.preventDefault();
	setError(null);
	setLoading(true);

	const result = logIn(email, password);

	if (!result.success) {
		setError(result.error);
		setLoading(false);
		return;
	}

	router.push("/dashboard");
}

	return (
		<div className="flex min-h-screen items-center justify-center bg-black px-4">
			<div className="w-full max-w-sm">
				<h1 className="mb-8 text-3xl font-bold text-white">Welcome back</h1>

				{error && (
					<p className="mb-4 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400">
						{error}
					</p>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="login-email"
							className="mb-1 block text-sm text-white/70"
						>
							Email
						</label>
						<input
							id="login-email"
							type="email"
							data-testid="auth-login-email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label
							htmlFor="login-password"
							className="mb-1 block text-sm text-white/70"
						>
							Password
						</label>
						<input
							id="login-password"
							type="password"
							data-testid="auth-login-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						data-testid="auth-login-submit"
						disabled={loading}
						className="w-full rounded-md bg-white py-2 font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
					>
						{loading ? "Logging in..." : "Log in"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-white/40">
					No account?{" "}
					<a href="/signup" className="text-white underline">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}
