## 2024-05-22 - [Mobile Menu ARIA Label]
**Learning:** Icon-only navigation buttons in custom multi-page HTML apps often lack ARIA labels, which makes screen readers announce them as just "button". Adding aria-label="Toggle navigation menu" instantly improves screen reader context for the main mobile toggle.
**Action:** Always verify icon-only buttons (like SVGs wrapped in `<button>`) have `aria-label` attributes.

## 2026-05-24 - [Explicitly Linked Form Labels]
**Learning:** Placing a `<label>` directly before an input element without an explicit `for` attribute mapping to the input's `id` is insufficient for accessibility. Screen readers require the explicit link to accurately announce the input's purpose, and it enables clicking the label to focus the input.
**Action:** Always ensure every form input, select, and textarea has a unique `id` and that its associated `<label>` uses the `for` attribute matching that `id`.

## 2024-05-26 - [Custom Focus Indicators]
**Learning:** Removing default browser focus rings (e.g., using Tailwind's `focus:outline-none`) without providing a custom visual focus indicator significantly harms accessibility for keyboard users.
**Action:** Always provide custom focus styles (like `focus:border-[color]` and `focus:ring-[width]`) when disabling the default browser outline, ensuring they are applied to all interactive elements such as buttons and form inputs.

## $(date +%Y-%m-%d) - [Regex Specificity in Tailwind CSS Patching]
**Learning:** Using broad regex replacements (like `sed s/outline-none/.../`) to fix accessibility issues causes severe side effects when utility classes are shared across multiple UI components (e.g., corrupting mobile navigation).
**Action:** When applying Tailwind utility classes programmatically via scripts, use strict boundaries (e.g., `outline-none link-hover`) and target only the specific elements or files intended to prevent cascading styling failures.
