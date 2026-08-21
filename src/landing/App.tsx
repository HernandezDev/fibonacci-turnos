import './index.css';
import { Seo } from './components/Seo';

export function App() {
    return (
        <main>
            <h1>Instituto Fibonacci</h1>
            <p>Reservá tu clase particular en minutos.</p>
            <a href="/app">Reservar turno</a>
        </main>
    );
}

export const DocumentHead = () => (
    <Seo
        title="Instituto Fibonacci — Turnos"
        description="Sistema de reserva de turnos del Instituto Fibonacci."
    />
);