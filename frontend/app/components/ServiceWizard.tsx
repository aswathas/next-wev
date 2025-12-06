"use client";

import { useState } from 'react';
import styles from './ServiceWizard.module.css';

interface Step {
    step_id: number;
    title: string;
    description: string;
    action_label?: string;
    link?: string;
    details?: string;
}

interface WizardProps {
    steps: Step[];
    checklist: string[];
    officialLink: string;
}

export default function ServiceWizard({ steps, checklist, officialLink }: WizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    const totalSteps = steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const toggleCheck = (index: number) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) setCurrentStep(c => c + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
    };

    // Calculate completion of checklist
    const checklistCount = checklist.length;
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const checklistProgress = Math.round((checkedCount / checklistCount) * 100);

    return (
        <div className={styles.wizardContainer}>
            {/* Main Wizard Area */}
            <div className={styles.mainPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="gradient-text">Step {currentStep + 1} of {totalSteps}</h2>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        {Math.round(progress)}% Complete
                    </span>
                </div>

                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>

                <div className={`${styles.stepCard} ${styles.activeStep} animate-fade-in`}>
                    <div className={`${styles.stepNumber} ${styles.activeStepNumber}`}>
                        {steps[currentStep].step_id}
                    </div>

                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                        {steps[currentStep].title}
                    </h2>

                    <p style={{ fontSize: '1.1rem', color: '#e2e8f0', lineHeight: '1.7' }}>
                        {steps[currentStep].description}
                    </p>

                    {steps[currentStep].details && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            borderLeft: '3px solid var(--color-accent)'
                        }}>
                            <strong>💡 Tip: </strong> {steps[currentStep].details}
                        </div>
                    )}

                    <div className={styles.controls}>
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                color: currentStep === 0 ? 'rgba(255,255,255,0.2)' : 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Previous
                        </button>

                        {steps[currentStep].link ? (
                            <a
                                href={steps[currentStep].link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ textDecoration: 'none', display: 'inline-block' }}
                            >
                                {steps[currentStep].action_label || 'Open Link'} ↗
                            </a>
                        ) : (
                            <button onClick={handleNext} className="btn-primary">
                                {currentStep === totalSteps - 1 ? 'Finish Guide' : 'Next Step'}
                            </button>
                        )}

                        {/* Alternative Next button if link exists */}
                        {steps[currentStep].link && currentStep < totalSteps - 1 && (
                            <button onClick={handleNext} style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}>
                                Continue →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Checklist */}
            <div className={styles.sidebar}>
                <div className={styles.checklist}>
                    <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                        Documents Checklist
                    </h3>
                    <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {checkedCount}/{checklistCount} Ready
                    </div>
                    {checklist.map((item, index) => (
                        <div
                            key={index}
                            className={styles.checkItem}
                            onClick={() => toggleCheck(index)}
                        >
                            <div className={`${styles.checkbox} ${checkedItems[index] ? styles.checked : ''}`}>
                                {checkedItems[index] && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </div>
                            <span style={{ textDecoration: checkedItems[index] ? 'line-through' : 'none', opacity: checkedItems[index] ? 0.5 : 1 }}>
                                {item}
                            </span>
                        </div>
                    ))}

                    <button
                        onClick={() => window.print()}
                        style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            padding: '0.75rem',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--color-text-muted)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        🖨️ Print Checklist
                    </button>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#fbbf24' }}>Quick Actions</h4>
                    <a href={officialLink} target="_blank" style={{
                        display: 'block',
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem'
                    }}>
                        Video Tutorial (Coming Soon)
                    </a>
                    <a href="/ai/explain" style={{
                        display: 'block',
                        color: 'var(--color-primary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                    }}>
                        Ask AI Assistant
                    </a>
                </div>
            </div>
        </div>
    );
}
