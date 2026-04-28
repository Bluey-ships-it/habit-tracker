import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/src/components/shared/ServiceWorkerRegister";

export const metadata: Metadata = {
	title: "Habit Tracker",
	description: "Build better habits every day",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#000000" />
			</head>
			<body className="bg-black antialiased">
				<ServiceWorkerRegister />
				{children}
			</body>
		</html>
	);
}
