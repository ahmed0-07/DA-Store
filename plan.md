# DA-Store implementation plan

## Problem and approach

The repository currently has a working foundation for Google authentication, users/addresses, categories, products/images, and guest or authenticated carts. The order module is only partially wired, and the current branch does not build because `Order.Validation.ts` contains an undefined `paymentProvider` shorthand property. The plan below prioritizes restoring a build and making checkout/order behavior correct and safe, then adds operational quality and optional product features.

Each item includes the feature or change, why it is better, and the user-facing capability it enables.

## Priority 0 — unblock and protect core behavior

1. **Repair the order validation schema and wire request validation.**
   - Add an explicit payment-provider field (or an enum/allow-list), validate the `Idempotency-Key` header case-insensitively through the request-validation design, validate order IDs/statuses, and attach the validated data to the request.
   - **Why better:** the project cannot currently compile, and unvalidated checkout input can create malformed orders or inconsistent payment records.
   - **Features:** reliable `POST /orders`, predictable validation errors, and safe provider selection.

2. **Complete order creation as one database transaction.**
   - Read the authenticated user's cart and selected address, verify active products and stock, calculate totals from database prices, snapshot item names/prices, decrement stock, create the order/payment record, and clear the cart in a transaction.
   - **Why better:** prevents overselling, client-side price tampering, partial orders, and duplicate charges.
   - **Features:** real checkout, immutable order history, idempotent retries, and accurate totals.

3. **Finish order reads and fix ownership/awaiting bugs.**
   - Include order items/payments in list/detail responses, `await` `getOrder`, return a clear 404 for missing orders, and ensure customers can only access their own records.
   - **Why better:** the current detail endpoint returns a promise-shaped response and can hide missing data; complete responses are necessary for order tracking.
   - **Features:** order history, order detail pages, itemized receipts, and payment status display.

4. **Implement order status transitions and admin order listing.**
   - Add an allow-listed transition state machine, admin status validation, filtering by status/date/user, stable sorting, and bounded pagination with metadata. Register `/admin/*` routes before `/:id`.
   - **Why better:** prevents invalid lifecycle changes and fixes the current route collision where `GET /admin/all` can be captured by `GET /:id`.
   - **Features:** admin fulfillment workflow, shipment progression, searchable order management, and safe pagination.

5. **Make cancellation rules explicit and transactional.**
   - Permit cancellation only in allowed states, return a useful conflict when cancellation is no longer possible, restore stock exactly once, and distinguish customer cancellation from admin cancellation.
   - **Why better:** avoids negative inventory and contradictory order states.
   - **Features:** customer self-service cancellation, admin override policy, and inventory recovery.

6. **Fix user-resource authorization for addresses.**
   - Scope update/delete queries by both address ID and authenticated user ID; make default-address updates atomic and enforce at most one default address per user.
   - **Why better:** the current endpoints allow an authenticated user who knows another address ID to modify or delete it.
   - **Features:** secure address book, default shipping selection, and correct checkout address ownership.

7. **Correct guest-cart identity and merge behavior.**
   - Use one documented source for the session token, merge the guest cart's items into the authenticated cart rather than relabeling one cart, resolve quantity conflicts with stock checks, and remove/archive the guest cart transactionally.
   - **Why better:** the current controller validates a body token but reads only a header, and the service does not actually merge items.
   - **Features:** sign-in after shopping without losing items, duplicate-safe quantities, and consistent cart ownership.

## Priority 1 — make the existing modules production-ready

8. **Add complete validation and response contracts.**
   - Validate query strings, UUIDs, pagination limits, IDs, trimmed string lengths, image URLs, and cross-field rules; reject unknown fields where appropriate; standardize `{ status, message, data, errors, meta }` responses and status codes.
   - **Why better:** reduces runtime database errors and gives frontend clients a stable contract.
   - **Features:** safer forms, useful field-level errors, and consistent client integration.

9. **Harden authentication and environment configuration.**
   - Add JWT expiry/issuer/audience and runtime payload guards, avoid non-null assertions for Google profile data, configure the OAuth callback URL from environment, provide a real failure response, and use separate development/production env requirements.
   - **Why better:** limits token replay, prevents malformed OAuth users, and avoids deployment-specific hardcoded behavior.
   - **Features:** secure sessions, deployable Google login, and actionable authentication failures.

10. **Add HTTP security and lifecycle middleware.**
    - Configure Helmet, explicit CORS origins, JSON body-size limits, rate limits for auth/checkout, request IDs, structured logging, graceful shutdown, and Prisma disconnect handling.
    - **Why better:** reduces common web abuse and makes failures diagnosable in production.
    - **Features:** safer public APIs, controlled cross-origin access, and clean deploy/restart behavior.

11. **Improve catalog correctness and management.**
    - Add category/product ownership of constraints, slug generation/normalization, category and active-status filters, search/sort/pagination, and prevent orphaned or invalid category references.
    - **Why better:** large catalog responses do not scale, and manually supplied slugs/filters can drift or produce inconsistent URLs.
    - **Features:** storefront search, category browsing, sorting, and efficient admin catalog maintenance.

12. **Make product-image handling deterministic.**
    - Enforce one primary image per product at the database/service level, use transaction-safe promotion/deletion behavior, validate URL formats, and return images in list/detail projections as intended.
    - **Why better:** concurrent requests can currently create multiple primary images.
    - **Features:** reliable product galleries, fallback primary-image selection, and ordered thumbnails.

13. **Normalize data access and database performance.**
    - Reuse typed Prisma select/include projections, remove unused imports, add indexes for order status/date and common product queries, make user carts unique, and avoid repeated cart reload queries where a transaction can return the result.
    - **Why better:** lowers payload size and query count while preventing ambiguous records and slow admin/storefront queries.
    - **Features:** faster catalog/cart pages and predictable scaling.

## Priority 2 — verification, delivery, and documentation

14. **Create automated tests and a real quality gate.**
    - Add unit tests for validation, JWT, status transitions, totals, stock, cart merging, and authorization; add integration tests for every route and Prisma transaction; replace the placeholder `test` script and run build/type-check in CI.
    - **Why better:** checkout and permission regressions are high impact and are currently easy to introduce unnoticed.
    - **Features:** safe refactoring, repeatable releases, and documented API behavior.

15. **Document and operationalize the API.**
    - Add a README with setup/migrations/env instructions, endpoint examples, auth/session-token behavior, error shapes, order lifecycle rules, and OpenAPI/Swagger documentation; add seed data and migration/deployment guidance.
    - **Why better:** reduces onboarding time and prevents frontend/deployment assumptions from becoming hidden bugs.
    - **Features:** self-service local setup, browsable API docs, and reproducible environments.

16. **Add payment-provider integration and webhook reconciliation.**
    - Define a provider adapter, create payment intents, verify signed webhooks, make webhook processing idempotent, reconcile payment/order states, and support refunds.
    - **Why better:** the schema has payment concepts but no provider integration; trusting client payment status would be unsafe.
    - **Features:** card/wallet checkout, payment confirmation, failed-payment recovery, refunds, and reliable paid-order state.

## Priority 3 — optional product features after the core is stable

17. **Add customer account and merchandising features.**
    - Add profile updates, email/account linking policy, wishlist/favorites, reviews/ratings, coupons/promotions, low-stock indicators, and inventory adjustment history.
    - **Why better:** improves retention and merchandising only after ordering and inventory are trustworthy.
    - **Features:** richer customer accounts, social proof, discounts, and inventory operations.

18. **Add fulfillment and customer communication.**
    - Add shipping provider/address normalization, tracking numbers, email notifications for order/payment/shipping events, downloadable invoices, and admin audit logs.
    - **Why better:** makes the system useful beyond order capture and gives customers visibility after purchase.
    - **Features:** shipment tracking, receipts, lifecycle notifications, and accountable admin actions.

## Suggested execution order

Repair the build and validation first, then implement the checkout transaction, order lifecycle, address authorization, and cart merging. Next harden auth/HTTP behavior and catalog queries, then add tests and documentation. Payment integration and optional merchandising/fulfillment features should follow only after those invariants are covered by automated tests.

