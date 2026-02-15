# Specification

## Summary
**Goal:** Stop “user not registered” errors during checkout by requiring login for order placement and aligning backend authorization with Internet Identity authentication.

**Planned changes:**
- Frontend: On the Checkout page, detect when the visitor is not authenticated and block any attempt to place an order; show a clear English prompt to log in.
- Frontend: Ensure visiting `/checkout` while logged out does not trigger unstable UI behavior or backend calls for order placement.
- Backend: Update user-scoped authorization so any authenticated (non-anonymous) caller can use checkout-related methods (cart retrieval, totals calculation, order placement) without “not registered”/authorization errors.
- Backend: Keep admin-only protections unchanged for admin-gated methods.
- Frontend: Improve error handling/toasts so authorization/identity failures show friendly English guidance (no “user not registered” phrasing), while other errors show appropriate English messages.

**User-visible outcome:** Logged-out users are prompted to log in before placing an order, and logged-in customers can place orders successfully without seeing “user not registered”; any checkout/order errors are shown as clear English messages.
