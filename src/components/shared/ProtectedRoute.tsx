"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/lib/storage";
import { Session } from "@/src/types/auth";

type Props = {
	children: (session: Session) => React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
	const router = useRouter();
	const [session, setSession] = useState<Session | null>(null);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const existing = getSession();

		if (!existing) {
			router.replace("/login");
			return;
		}

		setSession(existing);
		setChecked(true);
	}, [router]);

	if (!checked || !session) return null;

	return <>{children(session)}</>;
}
