import './index.css';
import { Seo } from './components/Seo';

export function App() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-8 text-center">
            <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-800">
                🚧 Placeholder
            </span>
            <h1 className="text-3xl font-bold text-slate-900">
                Acá va la landing del Instituto Fibonacci
            </h1>
            <p className="max-w-md text-slate-600">
                Esta página confirma que el pipeline de SSG + Tailwind está andando.
                El contenido real todavía no está definido.
            </p>

            <a
                href="/app"
                className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
                Ir al sistema de turnos →
            </a>
        </main>
    );
}

export const DocumentHead = () => (
    <Seo
        title="Instituto Fibonacci — Turnos"
        description="Sistema de reserva de turnos del Instituto Fibonacci."
    />
);