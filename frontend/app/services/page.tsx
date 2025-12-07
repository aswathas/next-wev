"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/app/lib/api';

interface Service {
    id: string;
    name: string;
    description: string;
    version: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch(getApiUrl('api/services'));
                if (!res.ok) throw new Error('Failed to fetch services');
                const data = await res.json();
                setServices(data);
            } catch (err) {
                setError('Could not load services. Please make sure the backend is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading services...</div>;

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/" style={{ marginBottom: '2rem', display: 'inline-block', color: 'var(--color-primary)', textDecoration: 'none' }}>
                ← Back to Home
            </Link>

            <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Government Services</h1>

            {error && (
                <div style={{ padding: '1rem', background: 'rgba(255,0,0,0.1)', color: '#fda4af', borderRadius: '8px', marginBottom: '2rem' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {services.map((service) => (
                    <Link href={`/services/${service.id}`} key={service.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-panel" style={{ height: '100%', transition: 'transform 0.2s', cursor: 'pointer' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{service.name}</h2>
                            <p style={{ color: 'var(--color-text-muted)' }}>{service.description}</p>
                            <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.6 }}>
                                Version: {service.version}
                            </div>
                        </div>
                    </Link>
                ))}

                {services.length === 0 && !error && (
                    <p style={{ color: 'var(--color-text-muted)' }}>No services found.</p>
                )}
            </div>
        </div>
    );
}
