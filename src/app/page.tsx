"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "../components/shared/SpalshScreen";
import { getSession } from "@/src/lib/storage";
import { SPLASH_DURATION } from "@/src/lib/constants";

export default function HomePage() {
	const router = useRouter();
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
			const session = getSession();

			if (session?.userId) {
				router.replace("/dashboard");
			} else {
				router.replace("/login");
			}
		}, SPLASH_DURATION);

		return () => clearTimeout(timer);
	}, [router]);

	return <SplashScreen show={show} />;
}
