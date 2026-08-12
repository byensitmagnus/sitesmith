// BRIEF.md, front matter: a visible, permanent line stating the company is fictional
// and that nothing on the page may be used as a basis for a decision. Rendered on
// every page (see app/layout.tsx and SiteFooter.tsx), never behind a button, a
// dialog, or a disclosure -- it is plain static markup, nothing to expand.
import { DISCLOSURE_TEXT } from "@/lib/content.js";

export function DisclosureStrip() {
  return (
    <div className="disclosure-strip">
      <p className="disclosure-strip__inner">
        <strong>Fiktiv virksomhed.</strong> {DISCLOSURE_TEXT}
      </p>
    </div>
  );
}
