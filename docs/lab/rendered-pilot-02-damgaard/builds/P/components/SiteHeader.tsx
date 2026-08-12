"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Mark";
import { DisclosureStrip } from "./DisclosureStrip";
import { COMPANY } from "@/lib/content.js";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      {/* Inside the header landmark on purpose (axe "region" rule): a fixed strip
          directly under <body> sits outside every landmark. It is still the first
          thing rendered on every page, never collapsible -- see BRIEF.md front matter. */}
      <DisclosureStrip />
      <div className="site-header__bar">
        <Link href="/" className="brand">
          <Mark size={30} className="brand__mark" />
          <span className="brand__name" data-asset="wordmark">
            {COMPANY.name}
          </span>
        </Link>
        <nav className="site-nav" aria-label="Hovedmenu">
          <Link
            href="/priser"
            className="site-nav__link"
            aria-current={pathname === "/priser" ? "page" : undefined}
          >
            Priser
          </Link>
          <a className="site-nav__phone figure" href={COMPANY.phoneHref}>
            {COMPANY.phoneDisplay}
          </a>
          <Link href="/bestil" className="btn btn--primary">
            Book en fugtgennemgang
          </Link>
        </nav>
      </div>
    </header>
  );
}
