## 2024-05-22 - [Mobile Menu ARIA Label]
**Learning:** Icon-only navigation buttons in custom multi-page HTML apps often lack ARIA labels, which makes screen readers announce them as just "button". Adding aria-label="Toggle navigation menu" instantly improves screen reader context for the main mobile toggle.
**Action:** Always verify icon-only buttons (like SVGs wrapped in `<button>`) have `aria-label` attributes.
