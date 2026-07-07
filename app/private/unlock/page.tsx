import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private",
  description: "Private work-OS.",
  robots: { index: false, follow: false },
};

type UnlockPageProps = {
  searchParams: Promise<{ to?: string; err?: string }>;
};

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const { to = "/private/projects", err } = await searchParams;

  return (
    <main
      id="main-content"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
      }}
    >
      <form
        method="post"
        action="/api/private/unlock"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#ffffff",
          border: "1px solid rgba(30, 41, 59, 0.15)",
          borderRadius: 14,
          padding: "2rem 1.5rem",
          boxShadow: "0 6px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.35rem", color: "#0f172a" }}>
          Private work-OS
        </h1>
        <p style={{ marginTop: 8, fontSize: "0.95rem", color: "#475569" }}>
          Interview prep, drafts, and notes I don&apos;t want indexed publicly.
          Enter the passphrase to unlock.
        </p>
        <input type="hidden" name="to" value={to} />
        <label
          style={{
            display: "block",
            marginTop: 20,
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Passphrase
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            style={{
              display: "block",
              width: "100%",
              marginTop: 6,
              padding: "0.65rem 0.8rem",
              fontSize: "1rem",
              border: "1px solid rgba(30, 41, 59, 0.25)",
              borderRadius: 8,
              background: "#ffffff",
              color: "#0f172a",
            }}
          />
        </label>
        {err ? (
          <p
            style={{
              marginTop: 12,
              fontSize: "0.85rem",
              color: "#b91c1c",
            }}
          >
            That&apos;s not the right passphrase — try again.
          </p>
        ) : null}
        <button
          type="submit"
          style={{
            marginTop: 20,
            width: "100%",
            padding: "0.7rem 1rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#ffffff",
            background: "#2563eb",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Unlock
        </button>
      </form>
    </main>
  );
}
