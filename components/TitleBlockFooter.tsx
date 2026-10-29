import { KMark } from "./KMark";
import styles from "./TitleBlockFooter.module.css";

const K = "https://www.klarum.com";

const columns = [
  {
    label: "Product",
    links: [
      ["Notices", `${K}/notices`],
      ["Pricing", `${K}/pricing`],
      ["Integrations", `${K}/integrations`],
      ["Changelog", `${K}/changelog`],
    ],
  },
  {
    label: "Klarum",
    links: [
      ["About us", `${K}/about`],
      ["Articles", `${K}/articles`],
      ["Contact", `${K}/contact`],
      ["Research", `${K}/research`],
    ],
  },
  {
    label: "Legal",
    links: [
      ["Privacy", `${K}/legal#privacy`],
      ["Terms", `${K}/legal#terms`],
      ["Security", `${K}/legal#security`],
      ["Trust Center", `${K}/legal#trust`],
    ],
  },
] as const;

type Props = {
  /** Drawing-sheet details for the page this footer closes. */
  sheet?: string;
  rev?: string;
  title?: string;
};

/**
 * Footer drawn as an engineering drawing's title block (idea kept from the Print direction),
 * set in the Night tokens. Static: no motion.
 */
export function TitleBlockFooter({ sheet = "A-101", rev = "C", title = "Home." }: Props) {
  return (
    <footer className={styles.foot}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brandCol}>
          <a className={styles.brand} href={K} aria-label="Klarum home">
            <KMark height={28} className={styles.brandMark} />
            <b>Klarum</b>
          </a>
          <p className={styles.blurb}>
            The system of record for AI-native bid management. Built in Stockholm.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.label} aria-label={col.label}>
            <p className="lab">{col.label}</p>
            <ul className={styles.links}>
              {col.links.map(([name, href]) => (
                <li key={name}>
                  <a href={href}>{name}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={`wrap ${styles.sheetRow}`}>
        <table className={styles.tb} aria-label="Sheet information">
          <tbody>
            <tr>
              <td colSpan={2} rowSpan={2} className={styles.tbMark}>
                <KMark height={26} title="Klarum" />
              </td>
              <td>
                <span className={styles.k}>Sheet</span>
                <span className={`${styles.v} ${styles.code}`}>{sheet}</span>
              </td>
              <td>
                <span className={styles.k}>Rev</span>
                <span className={`${styles.v} ${styles.code} ${styles.red}`}>{rev}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className={styles.k}>Title</span>
                <span className={styles.v}>{title}</span>
              </td>
              <td>
                <span className={styles.k}>Scale</span>
                <span className={`${styles.v} ${styles.code}`}>1:1</span>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <span className={styles.k}>Office</span>
                <span className={styles.v}>Medborgarplatsen 25, 118 72 Stockholm</span>
              </td>
              <td>
                <span className={styles.k}>Contact</span>
                <a className={styles.v} href="mailto:um@klarum.com">
                  um@klarum.com
                </a>
              </td>
              <td>
                <span className={styles.k}>Year</span>
                <span className={`${styles.v} ${styles.code}`}>2026</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p className={`lab ${styles.copy}`}>© 2026 Klarum Technologies AB</p>
      </div>

      <div className={styles.bigMark} aria-hidden="true">
        <KMark height={872} />
      </div>
    </footer>
  );
}
