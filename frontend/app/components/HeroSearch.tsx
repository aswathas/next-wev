"use client";

import { useRouter } from 'next/navigation';

export default function HeroSearch() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('q') as HTMLInputElement;
        if (input.value.trim()) {
            router.push(`/ai/explain?initial=${encodeURIComponent(input.value)}`);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', width: '100%', maxWidth: '400px' }}
        >
            <input
                name="q"
                type="text"
                placeholder="What do you need help with today?"
                style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white'
                }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
                →
            </button>
        </form>
    );
}
