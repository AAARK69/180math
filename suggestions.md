# Improvement Suggestions for 180 Math

## 1. Performance
* **Canvas State Redundancy**: In `main.js`, `renderParticles()` repeatedly sets invariant canvas properties if they were to be modified inside loops. Ensure properties like `ctx.globalAlpha` are correctly restored and standard canvas settings (`ctx.font`, `ctx.fillStyle`, `ctx.textAlign`) are set once outside the render loop where possible. The current `symbolCtx` sets them once outside, which is good. For `ctx.globalAlpha`, it correctly scales opacity using size.
* **Math Operations**: Inside `updateParticles()`, distance checking `distSq < 22500` is well-implemented. However, the force calculation `vx += (dx / dist) * force * 1.5` where `force = (150 - dist) / 150` can be algebraically simplified to remove the division by `dist` if refactored correctly, e.g., `vx += dx * ((150 - dist) / (150 * dist)) * 1.5`, though JavaScript engines optimize this quite well. More critically, always guard `dist` calculations with `if (distSq > 0)` before taking square root and dividing to prevent `NaN` during exact overlap.
* **CSS/Layout Thrashing**: Wait for `requestAnimationFrame` before querying DOM elements or ensure boundingClientRect is cached correctly. The current `updateRects` implementation correctly caches rects.

## 2. Accessibility
* **Focus Outlines**: The project utilizes Tailwind CSS and likely disables default focus rings without providing alternative visual cues. Ensure custom focus states (`focus-visible:ring-2`, `focus-visible:ring-[#E5BE85]`) are added to all interactive elements (`a`, `button`, `input`) when `focus:outline-none` is used.
* **Aria Labels**: Any icon-only buttons or interactive UI elements relying purely on visual symbols need `aria-label` attributes to provide context for screen readers.
* **Form Inputs**: Ensure all forms (e.g., in `contact.html`) have unique `id` attributes on inputs and associated `<label for="id">` to ensure programmatic linkage for assistive technologies.

## 3. Code Quality
* **Global Pollution**: Multiple functions and variables in `main.js` are attached directly to `window` (e.g., `window.cards`, `window.updateRects`, `window.resizeObserver`). Consider wrapping the entire application logic in an IIFE or module pattern to encapsulate the state and prevent global namespace pollution unless explicitly required for external testing.
* **Test Architecture**: Extracting logic via regex for Jest tests in Node environments (e.g., `handleCollision.test.js`) is brittle. A better architectural pattern is to export these functions explicitly if in a module environment or refactor the code to utilize modern JS modules, although sticking to the current memory directives of regex extraction is mandated for this specific task setup.
* **Code Duplication**: Navigation menus across HTML files (`index.html`, `about.html`, etc.) are likely duplicated. Consider server-side includes or a simple static site generator build step in the future to manage multi-page setups efficiently.

## 4. Design & UX
* **Tilt/Hover Effects**: Ensure that `main.js` sticks strictly to 2D spotlight effects by updating `--mouse-x` and `--mouse-y`. Do not introduce 3D tilt effects via JavaScript transforms as they lead to erratic behaviors according to design preferences.
* **Mobile Responsiveness**: Implement mobile-specific optimizations as noted in preferences: 48px minimum touch targets, `scroll-mt-24` to prevent header overlap, and ensuring particles are scaled down properly for 120FPS on mobile.
* **Theming Consistency**: Strict adherence to Apple Dark Mode design guidelines: Gold (#E5BE85) and Midnight (#0B0B33) colors, SF Pro typography (`font-[system-ui]`), hairline borders, and pill-shaped rounded elements.
