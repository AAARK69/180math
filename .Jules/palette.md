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

## 2024-05-28 - [Form Placeholder Context]
**Learning:** Adding descriptive placeholders (like "e.g. Jane Doe" or "(555) 123-4567") significantly reduces cognitive load by providing a clear example of the expected format, guiding users effectively before they even type.
**Action:** Always include helpful `placeholder` attributes for form inputs where the expected format or type of input can be clarified by example. Ensure they maintain contrast constraints with `placeholder:text-[color]` styles.
