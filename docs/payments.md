# Payments

## How a booking is paid

| Step | Card | Bitcoin, stablecoin, Venmo, Cash App, Zelle |
|---|---|---|
| Guest sends a request | A **hold** for the 50% deposit is placed on the card. Nothing is charged. | Nothing is collected. |
| Owner taps **Approve** in Telegram | The hold is **charged**. Booking is confirmed. | Status becomes "approved, deposit due". Telegram shows the guest's private booking page link; email it to them. |
| Guest pays | (done) | The booking page shows where to send the deposit (and lets them pay by card instead). Tap **💰 Deposit received** in Telegram when it arrives. |
| Owner taps **Deny** | The hold is **released**. The guest was never charged. | Nothing to undo. |

- Square keeps a card hold for **7 days**. If you approve after that, the hold has
  lapsed; the guest gets a booking page link to pay by card again.
- All prices are calculated on the server from the pricing settings. The browser's
  numbers are never used for what is charged.
- Before any card hold, and again on Approve, dates are re-checked against a fresh
  read of the Airbnb calendar.
- Balance (the other 50%) is due 30 days before check-in. It is collected manually.

## Turning methods on

Set these in Vercel (Project → Settings → Environment Variables), then redeploy.
A method appears on the booking page and to agents **only** when its setting is
filled in. Addresses and handles are shown to a guest only after you approve
their request.

| Method | Variable(s) | Example |
|---|---|---|
| Card | `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `NEXT_PUBLIC_SQUARE_APP_ID`, `NEXT_PUBLIC_SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT=production` | (already set) |
| Bitcoin | `PAY_BITCOIN_ADDRESS` and/or `PAY_BITCOIN_LIGHTNING` | `bc1q…` / `you@getalby.com` |
| Stablecoin | `PAY_STABLECOIN_EVM_ADDRESS` (one address works on all EVM chains), optional `PAY_STABLECOIN_EVM_CHAINS` (default `Base,Ethereum,Arbitrum`), and/or `PAY_STABLECOIN_SOLANA_ADDRESS` | `0x…` |
| Venmo | `PAY_VENMO_HANDLE` | `@Your-Handle` |
| Cash App | `PAY_CASHAPP_TAG` | `$YourTag` |
| Zelle | `PAY_ZELLE` (email or phone), optional `PAY_ZELLE_NAME` | `you@example.com` |
| Booking links | `BOOKING_LINK_SECRET` (any long random string; falls back to the Supabase service key) | |

Bitcoin gets the discount in `btc_discount_percent` (site settings, currently 15%).
The booking page shows the guest an approximate BTC amount at the current rate.

**Bitcoin privacy:** a single fixed address means every guest payment lands on the
same address, visible on-chain. A BTCPay Server (which can run on an Umbrel) gives
each guest a fresh address; it can be added later without changing the rest of
this flow.
