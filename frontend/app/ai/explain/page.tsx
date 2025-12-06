"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './chat.module.css';
import ServiceWizard from '@/app/components/ServiceWizard';

// Define Message Interface
interface Message {
    role: 'user' | 'assistant';
    content?: string;
    type?: 'text' | 'wizard';
    data?: any; // For wizard data
}

// Typewriter Effect Component
const Typewriter = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 15);
        return () => clearInterval(timer);
    }, [text]);

    return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
            {displayedText.split('\n').map((line, i) => (
                <p key={i} style={{ margin: 0, minHeight: line ? 'auto' : '0.5rem' }}>{line}</p>
            ))}
        </div>
    );
};

export default function AIExplainPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', type: 'text', content: 'Hello! I am FROMBUDDY. I can guide you through services like PAN, Aadhaar, and Voter ID.\n\nType "Apply for PAN" to see how I generate guides!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initial Query Handler
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('initial');
        if (initialQuery) {
            handleSend(initialQuery);
            window.history.replaceState({}, '', '/ai/explain');
        }
    }, []);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // 1. Add User Message
        const userMsg: Message = { role: 'user', type: 'text', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // 2. Call AI API (now returns Structured Guide + Explanation)
            const res = await fetch('http://127.0.0.1:8000/api/explain?query=' + encodeURIComponent(text), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.detail || 'Error connecting to assistant');

            // 3. Add AI Text Response
            const botMsg: Message = { role: 'assistant', type: 'text', content: data.explanation || "Here is the information." };

            setMessages(prev => {
                const newMsgs = [...prev, botMsg];

                // 4. Inject Wizard if steps are present in the AI response
                if (data.steps && data.steps.length > 0) {
                    newMsgs.push({
                        role: 'assistant',
                        type: 'wizard',
                        data: {
                            name: data.name,
                            steps: data.steps,
                            checklist: data.checklist || [],
                            official_link: data.official_link || '#'
                        }
                    });
                }
                return newMsgs;
            });

        } catch (err: any) {
            const errorMsg: Message = { role: 'assistant', type: 'text', content: `⚠️ Error: ${err.message}. Please try again.` };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>← Back</Link>
                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>FROMBUDDY Assistant</span>
                </div>
            </header>

            <div className={styles.chatContainer}>
                <div className={styles.messagesArea}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.botMessage}`}>

                            {/* Label */}
                            <div style={{
                                fontSize: '0.75rem',
                                marginBottom: '0.25rem',
                                opacity: 0.7,
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                marginLeft: msg.role === 'assistant' ? '0.5rem' : 0,
                                marginRight: msg.role === 'user' ? '0.5rem' : 0
                            }}>
                                {msg.role === 'user' ? 'You' : 'Assistant'}
                            </div>

                            {/* Content based on Type */}
                            {msg.type === 'text' && msg.content && (
                                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                                    {msg.role === 'assistant' ? (
                                        <Typewriter text={msg.content} />
                                    ) : (
                                        msg.content.split('\n').map((line, i) => (
                                            <p key={i} style={{ margin: 0, minHeight: line ? 'auto' : '0.5rem' }}>{line}</p>
                                        ))
                                    )}
                                </div>
                            )}

                            {msg.type === 'wizard' && msg.data && (
                                <div style={{ width: '100%', maxWidth: '850px', marginTop: '0.5rem' }}>
                                    <ServiceWizard
                                        steps={msg.data.steps}
                                        checklist={msg.data.checklist || []}
                                        officialLink={msg.data.official_link}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className={`${styles.message} ${styles.botMessage}`}>
                            <div className={`${styles.bubble} ${styles.botBubble}`} style={{ fontStyle: 'italic', opacity: 0.7 }}>
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputArea}>
                    <input
                        className={styles.inputField}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                        placeholder="Type 'PAN', 'Aadhaar'..."
                        disabled={loading}
                        autoFocus
                    />
                    <button
                        onClick={() => handleSend(input)}
                        disabled={loading || !input.trim()}
                        className="btn-primary"
                        style={{ height: '50px', width: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
