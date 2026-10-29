import Link from "next/link";

// Placeholder until the homepage is built (step 4). The components live at /lab.
export default function Home() {
  return (
    <main className="wrap" style={{ paddingBlock: "var(--s-112)" }}>
      <p className="lab">Klarum demo · work in progress</p>
      <h1 style={{ margin: "12px 0 0", fontSize: "var(--fs-h2)", fontWeight: 800, letterSpacing: "var(--ls-display)", lineHeight: "var(--lh-h2)" }}>
        Homepage coming next.
      </h1>
      <p style={{ marginTop: 16, color: "var(--body)" }}>
        <Link href="/lab" style={{ fontWeight: 600, textUnderlineOffset: 4 }}>
          See the personality components
        </Link>
      </p>
    </main>
  );
}
