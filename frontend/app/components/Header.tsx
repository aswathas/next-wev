"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import UserButtonComponent from "./UserButton";
import AuthButtons from "./AuthButtons";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(0, 0, 0, 0.3)",
      backdropFilter: "blur(10px)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <Link href="/" style={{ 
        textDecoration: "none", 
        fontSize: "1.5rem", 
        fontWeight: "bold",
        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        FROMBUDDY
      </Link>
      
      <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link href="/services" style={{ textDecoration: "none", color: "var(--color-text)" }}>
          Services
        </Link>
        <Link href="/ai/explain" style={{ textDecoration: "none", color: "var(--color-text)" }}>
          AI Assistant
        </Link>
        {isSignedIn ? <UserButtonComponent /> : <AuthButtons />}
      </nav>
    </header>
  );
}

