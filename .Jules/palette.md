## 2024-05-22 - [Mobile Menu ARIA Label]
**Learning:** Icon-only navigation buttons in custom multi-page HTML apps often lack ARIA labels, which makes screen readers announce them as just "button". Adding aria-label="Toggle navigation menu" instantly improves screen reader context for the main mobile toggle.
**Action:** Always verify icon-only buttons (like SVGs wrapped in `<button>`) have `aria-label` attributes.

## 2026-05-24 - [Explicitly Linked Form Labels]
**Learning:** Placing a `<label>` directly before an input element without an explicit `for` attribute mapping to the input's `id` is insufficient for accessibility. Screen readers require the explicit link to accurately announce the input's purpose, and it enables clicking the label to focus the input.
**Action:** Always ensure every form input, select, and textarea has a unique `id` and that its associated `<label>` uses the `for` attribute matching that `id`.

## 2024-05-26 - [Custom Focus Indicators]
**Learning:** Removing default browser focus rings (e.g., using Tailwind's `focus:outline-none`) without providing a custom visual focus indicator significantly harms accessibility for keyboard users.
**Action:** Always provide custom focus styles (like `focus:border-[color]` and `focus:ring-[width]`) when disabling the default browser outline, ensuring they are applied to all interactive elements such as buttons and form inputs.

## 2024-05-24 - Improve Keyboard Accessibility for Screen Reader Only Elements
**Learning:** Elements using `.sr-only` are completely hidden visually, meaning users navigating via keyboard (tabbing) get zero visual feedback when those inputs gain focus. This breaks keyboard navigation flow. In components like custom radio button groups where the actual input is hidden but the label acts as the visual trigger, the hidden input must still signal focus to its adjacent label.
**Action:** Always provide custom focus states (like `:focus-visible`) for hidden interactive elements (like `.sr-only` inputs) that proxy focus styles to their visible adjacent siblings (e.g., `input[type="radio"]:focus-visible + .option-label`).

## 2024-05-27 - [Focus Visible vs Focus]
**Learning:** Removing default browser focus rings (e.g., using Tailwind's `focus:outline-none`) without providing a custom visual focus indicator harms accessibility for keyboard users. However, adding custom focus styles using `:focus` (like `focus:border-[color]` and `focus:ring-[width]`) creates lingering visual rings when a user clicks the element with a mouse.
**Action:** Always provide custom focus styles using `focus-visible:` pseudo-classes instead of `focus:` to ensure visual focus rings are only shown for keyboard navigation and not upon mouse clicks.
## 2024-07-15 - Interactive Element State Transitions
**Learning:** Hiding structural UI elements (like "Next" buttons) dynamically causes sudden layout shifts and lacks visual affordance for the user regarding multi-step processes.
**Action:** Always prefer disabling elements with clear visual indicators (`disabled:opacity-50`, `disabled:cursor-not-allowed`) rather than toggling visibility classes (like `hidden`).

## 2026-07-26 - [Programmatic Focus Management for Dynamic Views]
**Learning:** When dynamically updating views without a page reload (e.g., single page app navigation or quiz views), screen readers are not inherently aware of the new content context and keyboard focus remains on the previous interaction element (like a 'Next' button). This forces users to tab backwards through potentially hidden or off-screen elements.
**Action:** Programmatically shift focus to the new primary heading by adding `tabindex="-1"` and calling `.focus()` via JavaScript. Concurrently, apply `focus:outline-none` to the element to prevent default browser focus rings on non-interactive focused elements.

## 2024-08-12 - [Global Form Submit Visual Loading Feedback]
**Learning:** When intercepting form `submit` events globally to provide visual loading states (e.g., disabling the button or adding a spinner), if a user submits a form and then clicks the browser's "Back" button, the page will often be restored from the back-forward cache (BFCache) with the button still permanently disabled and spinning.
**Action:** Always listen to the `pageshow` event and check if `e.persisted` is true to re-enable submit buttons when restoring from the back-forward cache. Additionally, ensure the `e.submitter` is used to target the exact button clicked, instead of relying on a generic `button[type="submit"]` selector that fails for `<input type="submit">` or multiple submit buttons.

## 2024-10-24 - [Mobile Default Visibility for Intersection Animations]
**Learning:** Initializing critical content with `opacity: 0` for scroll animations (`.reveal`) breaks the experience on mobile devices where viewport size discrepancies or JS intersection observer failures might prevent the "active" state from ever triggering. Content remains permanently invisible.
**Action:** Always make reveal animations default to fully visible (`opacity: 1`, `transform: none`) on small screens, and restrict the hidden initial state (`opacity: 0`) exclusively to desktop viewports using `@media (min-width: 768px)` to ensure content is accessible by default.
