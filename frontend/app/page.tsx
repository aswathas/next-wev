import Link from 'next/link';
import styles from './home.module.css';
import HeroSearch from './components/HeroSearch';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <section className={styles.hero}>
        <h1 className={`${styles.title} gradient-text animate-fade-in`}>
          FROMBUDDY
        </h1>
        <p className={`${styles.subtitle} animate-fade-in`} style={{ animationDelay: '0.1s' }}>
          Your Private, AI-Powered Assistant for Indian Government Services.
          <br />
          <span style={{ fontSize: '0.9rem', opacity: 0.8, display: 'block', marginTop: '0.5rem' }}>Simple. Secure. Stateless.</span>
        </p>

        <div className={`${styles.actions} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
          {/* Quick AI Search Box */}
          <HeroSearch />

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/services" className="btn-primary" style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--color-primary)' }}>
              Browse Services
            </Link>
            <a href="#features" className={styles.linkButton}>
              How it Works
            </a>
          </div>
        </div>
      </section>

      <section id="features" className={styles.grid}>
        <div className={`glass-panel ${styles.card}`}>
          <h3 style={{ color: 'var(--color-primary)' }}>🔒 Privacy First</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>We never store your data. No databases. No tracking. Your privacy is paramount.</p>
        </div>
        <div className={`glass-panel ${styles.card}`}>
          <h3 style={{ color: 'var(--color-secondary)' }}>🤖 AI Guidance</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Get instant, accurate explanations for complex procedures like PAN & Aadhaar corrections.</p>
          <Link href="/ai/explain" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 600 }}>
            Ask AI Assistant &rarr;
          </Link>
        </div>
        <div className={`glass-panel ${styles.card}`}>
          <h3 style={{ color: 'var(--color-accent)' }}>✅ Compliance</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Built with strict adherence to Indian laws. We do not autofill forms or impersonate official sites.</p>
        </div>
      </section>
    </div>
  );
}
