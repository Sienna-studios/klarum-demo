"use client";

import { useState } from "react";
import { URLS } from "@/lib/data";

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div>
      <div className="seg" role="group" aria-label="Billing period">
        <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
        <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly · two months free</button>
      </div>
      <div className="grid3 plans">
        <article className="surface plan">
          <p className="lab">Free</p>
          <p className="price"><span>€0</span></p>
          <p className="plan-sub">One seat. The floor of the plan ladder, not a trial that expires.</p>
          <ul className="plan-list">
            <li>Monthly matching allowance</li>
            <li>SharePoint and Google Drive connectors</li>
            <li>CSV and PDF exports</li>
            <li className="no">No drafting</li>
            <li className="no">No team features</li>
          </ul>
          <a href={URLS.pricing} className="btn btn-sec">See pricing</a>
        </article>
        <article className="surface plan rec">
          <p className="lab">Business · Recommended</p>
          <p className="price">
            <span>{yearly ? "€2,000" : "€200"}</span>
            <small>{yearly ? "per seat per year, excl. VAT" : "per seat per month, excl. VAT"}</small>
          </p>
          <p className="plan-sub">7-day trial, one per organisation, no payment method.</p>
          <ul className="plan-list">
            <li>Unmetered tender matching</li>
            <li>Proposal and bid-draft generation</li>
            <li>Team seats, org settings, invitations</li>
            <li>Seats prorated</li>
          </ul>
          <a href={URLS.trial} className="btn btn-pri">Start the Business trial</a>
        </article>
        <article className="surface plan">
          <p className="lab">Partner</p>
          <p className="price"><span className="price-t">Negotiated</span></p>
          <p className="plan-sub">Seat price and terms agreed with you, invoiced.</p>
          <ul className="plan-list">
            <li>Org-wide audit log and export</li>
            <li>Bespoke integrations</li>
            <li>Dedicated support</li>
            <li className="no">SSO and SCIM: Planned, not available</li>
          </ul>
          <a href={URLS.pricing} className="btn btn-sec">See pricing</a>
        </article>
      </div>
    </div>
  );
}
