type Props = {
	show: boolean;
};

export default function SplashScreen({ show }: Props) {
	if (!show) return null;

	return (
		<div
			data-testid="splash-screen"
			className="fixed inset-0 z-50 flex items-center justify-center bg-black"
		>
			<div className="text-center">
				<h1 className="text-4xl font-bold text-white tracking-tight">
					Habit Tracker
				</h1>
				<p className="mt-2 text-sm text-white/50">building better days</p>
			</div>
		</div>
	);
}
