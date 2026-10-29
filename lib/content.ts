// Shared copy for the light version. Every sentence maps to a row in claims.md.
export const BACKERS = ["KTH", "AI Sweden", "AWS", "Google Maps", "Apple", "Svea Solar", "Lyceum Technology"];

export const STEPS = [
  ["01", "Sourcing", "Every notice worth your time, in one feed.", "Sources include national procurement portals, TED and the development banks. Every notice links back to the original publication."],
  ["02", "Decision and drafting", "Go or no-go, then a draft cited to your own record.", "Klarum drafts submissions from your own references and cites the source page behind every claim."],
  ["03", "Lifecycle", "The bid does not end at submission.", "Track every bid."],
] as const;

export const DOCS = [
  ["Database", "Hosted in Frankfurt."],
  ["Model inference", "Runs in Stockholm on AWS Bedrock."],
  ["Document parsing", "Documents sent for parsing go to a US processor, which receives the whole document."],
  ["Training", "Customer content is not used for training."],
  ["Certifications", "None listed."],
] as const;

export const FAQ = [
  ["Is the free tier a trial?", "No. The free tier is the floor of the plan ladder, not a trial that expires. It has one seat, a monthly matching allowance, SharePoint and Google Drive connectors and CSV and PDF exports. It has no drafting and no team features."],
  ["How does the Business trial work?", "It lasts 7 days, one per organisation, and needs no payment method. Access pauses at expiry and your data is retained."],
  ["How are seats billed?", "Business is €200 per seat per month or €2,000 per seat per year, excl. VAT. Yearly saves two months. Seats are prorated."],
  ["What does Partner change?", "A negotiated seat price and terms, invoiced, plus an org-wide audit log and export, bespoke integrations and dedicated support. SSO and SCIM are planned, not available."],
  ["Which sources does Klarum search?", "Contracted public sources: national procurement portals, TED and the development banks. Every notice links back to the original publication."],
] as const;
