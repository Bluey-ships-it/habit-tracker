"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "../components/shared/SpalshScreen";
export default function HomePage() {
	const router = useRouter();
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			const sessionRaw = localStorage.getItem("habit-tracker-session");
			const session = sessionRaw ? JSON.parse(sessionRaw) : null;

			if (session?.userId) {
				router.replace("/dashboard");
			} else {
				router.replace("/login");
			}

			setShow(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, [router]);

	return <SplashScreen show={show} />;
}
