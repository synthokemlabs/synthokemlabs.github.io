import { ViewTransition } from "react";

/**
 * Re-mounts on every navigation. React's <ViewTransition> hands the change to the browser's
 * View Transitions API: the old page fades up and away, the new one rises in (see "Motion v5"
 * in globals.css). Browsers without support simply swap pages instantly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
