# Specification

## Summary
**Goal:** Enhance the site with richer animations, add an admin-only (Niraj) site logo upload that updates the header branding, and provide an admin-only Orders dashboard page to view all orders and who placed them.

**Planned changes:**
- Add more modern animations and micro-interactions across key pages (section entrance animations, hover/tap feedback, subtle navigation/page transitions) while keeping performance smooth and aligned with the existing theme.
- Backend: add a public query to fetch the current site logo (or none) and an admin-only method for Niraj to upload/replace the site logo using the existing ExternalBlob storage pattern and existing admin authorization checks.
- Frontend: update the header top-left branding to display the uploaded logo when available, with fallback to the current default branding when not set.
- Frontend: add an admin-only UI for Niraj to upload/replace the site logo with preview and clear success/error states; update the header logo after save without a full page reload.
- Add an admin-only “Orders” option/page in the Admin dashboard that lists all orders using the existing admin getAllOrders method and shows who placed each order (principal and profile name when available), with existing access-denied behavior for non-admins.

**User-visible outcome:** The site feels more animated and interactive, the admin (Niraj) can upload/replace a site logo that appears in the header, and the admin can open an Orders dashboard page to see all orders and who placed them.
