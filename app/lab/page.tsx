import type { Metadata } from "next";
import { CitedClaim } from "@/components/CitedClaim";
import { NoticeRow } from "@/components/NoticeRow";
import { TitleBlockFooter } from "@/components/TitleBlockFooter";
import { citedClaim, noticeById, notices } from "@/lib/notices";
import styles from "./lab.module.css";

export const metadata: Metadata = { title: "Klarum demo · personality components" };

function Panel({ theme }: { theme: "dark" | "light" }) {
  return (
    <div data-theme={theme} className={styles.panel}>
      <div className="wrap">
        <p className="lab">{theme} theme</p>

        <section aria-labelledby={`p1-${theme}`} className={styles.block}>
          <h2 id={`p1-${theme}`} className={styles.h}>
            P1 · Notice row
          </h2>
          <p className={styles.note}>
            Fit as five squares, hatched once shortlisted. Revision tag with history on hover or focus. Real notices;
            fit scores are sample values.
          </p>
          <ul className={styles.feed}>
            {notices.map((n, i) => (
              <NoticeRow key={n.id} notice={n} defaultShortlisted={i === 1} />
            ))}
          </ul>

          <p className={`lab ${styles.sub}`}>Compact, for the hero feed and workflow card</p>
          <ul className={`${styles.feed} ${styles.narrow}`}>
            {notices.map((n) => (
              <NoticeRow key={n.id} notice={n} compact />
            ))}
          </ul>
        </section>

        <section aria-labelledby={`p2-${theme}`} className={styles.block}>
          <h2 id={`p2-${theme}`} className={styles.h}>
            P2 · Cited claim
          </h2>
          <p className={styles.note}>
            The requirement is from a real World Bank REOI. Open the chip to see the source. Works without JavaScript.
          </p>
          <div className={styles.narrow}>
            <CitedClaim claim={citedClaim} source={noticeById(citedClaim.requirement_source)} />
          </div>
        </section>
      </div>

      <section aria-label={`P3 title-block footer, ${theme} theme`} className={styles.block}>
        <div className="wrap">
          <h2 className={styles.h}>P3 · Title-block footer</h2>
        </div>
        <TitleBlockFooter />
      </section>
    </div>
  );
}

export default function Lab() {
  return (
    <main>
      <header className={`wrap ${styles.top}`}>
        <p className="lab">Klarum demo · step 4a</p>
        <h1 className={styles.h1}>Personality components</h1>
        <p className={styles.note}>
          The three pieces that carry the identity, built before the page. Each appears in dark and light.
        </p>
      </header>
      <Panel theme="dark" />
      <Panel theme="light" />
    </main>
  );
}
