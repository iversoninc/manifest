## Project Status Board
- [x] Unify pan/zoom and drag logic between WireframeCanvas.tsx and Screen.tsx
- [x] Remove global listeners from Screen.tsx
- [x] Use getPointerPosition utility for event normalization in both components
- [x] Remove forced white/gradient background from Hi-Fi Screen component
- [x] Make border less prominent, label more subtle, and remove screen size indicator from Hi-Fi Screen
- [x] Update screen name/label to a centered, pill-shaped badge above the main card (per reference image)

## Executor's Feedback or Assistance Requests
- Pan/zoom and drag logic is now fully unified between both components. Both use the same event handler pattern and the shared getPointerPosition utility. No more global listeners or duplicative logic.
- Forced white/gradient background has been removed from the Hi-Fi Screen component. The background will now inherit from the parent or Tailwind classes (e.g., bg-gray-900 or bg-gray-800). Please visually verify that the Hi-Fi screens now match your desired background color.
- The border around each Hi-Fi screen is now less prominent (thinner and darker), the label is more subtle (smaller, lighter, normal weight), and the screen size indicator has been removed. Please visually verify these changes and let me know if further adjustments are needed.
- The screen name/label is now a centered, pill-shaped badge above the main card, styled to match your reference image. Please visually verify the new style and let me know if you want any further tweaks.

## Lessons
- Use a shared utility (like getPointerPosition) to normalize pointer events from different sources (DOM, Konva) to avoid duplicative logic and ensure consistent behavior across components. 