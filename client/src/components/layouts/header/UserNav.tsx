// FILE: src/components/layout/UserNav.tsx

"use client";

// All the old logic is gone! We just import the new component.
import { UserAccountNav } from "./UserAccountNav";

export function UserNav() {
  // The entire component is now just this one line.
  return <UserAccountNav />;
}
