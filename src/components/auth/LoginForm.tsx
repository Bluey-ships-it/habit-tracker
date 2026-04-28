"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logIn } from "@/src/lib/auth";
export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [redirectNotice, setRedirectNotice] = useState(false);

	useEffect(() => {
		if (!loading) return;

		const timeout = setTimeout(() => {
			setLoading(false);
			setError(
				"Login succeeded but redirect is taking longer than expected. Continue to dashboard manually.",
			);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [loading]);

function handleSubmit(e: React.FormEvent) {
	e.preventDefault();
	setError(null);
	setRedirectNotice(false);
	setLoading(true);

	const result = logIn(email, password);

	if (!result.success) {
		setError(result.error);
		setLoading(false);
		return;
	}

	setRedirectNotice(true);
	router.replace("/dashboard");
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
				{redirectNotice && !error && (
					<p className="mb-4 rounded-md bg-white/5 px-4 py-3 text-sm text-white/70">
						Login successful, redirecting...
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
							className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
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
							className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						data-testid="auth-login-submit"
						disabled={loading}
						className="w-full rounded-md bg-[#C2410C] py-2 font-semibold text-white transition hover:bg-[#9A3412] active:bg-[#9A3412] disabled:opacity-50"
					>
						{loading ? "Logging in..." : "Log in"}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-white/40">
					No account?{" "}
					<a
						href="/signup"
						className="text-[#C2410C] underline transition hover:text-[#9A3412] active:text-[#9A3412]"
					>
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}
