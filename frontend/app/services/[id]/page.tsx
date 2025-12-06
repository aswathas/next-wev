"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ServiceWizard from '@/app/components/ServiceWizard';

interface Step {
    step_id: number;
    title: string;
    description: string;
    action_label?: string;
    link?: string;
    details?: string;
}

interface ServiceDetail {
    id: string;
    name: string;
    description: string;
    version: string;
    last_updated: string;
    official_link: string;
    steps: Step[];
    documents_required?: string[];  // Support old key
    checklist?: string[];           // Support new key
    legal_disclaimer: string;
}

export default function ServiceDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [service, setService] = useState<ServiceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        async function fetchService() {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/services/${id}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Service not found");
                    throw new Error('Failed to fetch service details');
                }
                const data = await res.json();
                setService(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchService();
    }, [id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading service details...</div>;
    if (error) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#fca5a5' }}>Error</h2>
            <p>{error}</p>
            <Link href="/services" style={{ color: 'var(--color-primary)' }}>← Back to Services</Link>
        </div>
    );
    if (!service) return null;

    // Fallback for checklist/documents_required to ensure array
    const activeChecklist = service.checklist || service.documents_required || [];

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Link href="/services" style={{ marginBottom: '2rem', display: 'inline-block', color: 'var(--color-primary)', textDecoration: 'none' }}>
                ← Back to Services
            </Link>

            <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
                <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
                    <h1 className="gradient-text">{service.name}</h1>
                    <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '1rem' }}>{service.description}</p>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        <span>Version: {service.version}</span>
                        <span>Last Updated: {service.last_updated}</span>
                    </div>
                </div>

                {/* Wizard Component */}
                <ServiceWizard
                    steps={service.steps}
                    checklist={activeChecklist}
                    officialLink={service.official_link}
                />

                <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', opacity: 0.7 }}>
                    Disclaimer: {service.legal_disclaimer}
                </div>

            </div>
        </div>
    );
}
