// src/react-app/App.tsx
function App() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-8 text-center">
			<span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-800">
				🚧 Placeholder
			</span>
			<h1 className="text-3xl font-bold text-slate-900">
				Acá va la app de turnos
			</h1>
			<p className="max-w-md text-slate-600">
				Esta página confirma que el SPA y Tailwind están andando en{" "}
				<code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm">/app</code>.
				El contenido real (reservas, calendario, etc.) todavía no está definido.
			</p>

			<a
				href="/"
				className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
			>
				← Volver a la landing
			</a>
		</main>
	);
}

export default App;