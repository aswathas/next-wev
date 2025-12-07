"use client";

import { UserButton } from "@clerk/nextjs";

export default function UserButtonComponent() {
  return <UserButton afterSignOutUrl="/" />;
}

