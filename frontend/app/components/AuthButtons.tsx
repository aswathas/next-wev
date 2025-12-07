"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AuthButtons() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return null; // UserButton will be shown separately
  }

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <SignInButton mode="modal">
        <button className="btn-primary" style={{ 
          background: "transparent", 
          border: "1px solid var(--color-primary)",
          cursor: "pointer"
        }}>
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="btn-primary" style={{ cursor: "pointer" }}>
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}

