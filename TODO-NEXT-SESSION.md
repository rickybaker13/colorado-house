# Purgatory Townhouse (skipurgatoryhouse.com) - Next Session TODO

> Created: March 5, 2026
> Context: Follow-up items for booking pipeline, payments, and guest communication automation

---

## 1. Get Telegram Notifications Working

**Current state:** Telegram notification system was set up but is not currently delivering messages reliably.

**What needs to happen:**
- Debug the Telegram bot integration — check bot token, chat ID configuration
- Verify the bot is added to the correct chat/group
- Test the notification trigger pipeline end-to-end
- Ensure notifications fire for:
  - New booking requests
  - Payment received
  - Guest check-in reminders
  - Any system alerts (errors, cancellations, etc.)
- Check server logs for failed Telegram API calls
- Verify environment variables for Telegram bot token and chat ID are set correctly on the production server

---

## 2. Booking Approval Pipeline — End-to-End Verification

**Current state:** There is a system where a guest requests a booking, and the owner (you or your wife) approves it before the guest can pay. This needs to be verified as fully functional end-to-end.

**What needs to happen:**
- Test the complete flow:
  1. Guest visits booking page and submits a booking request (dates, guest count, contact info)
  2. Owner receives notification (email + Telegram) of new booking request
  3. Owner reviews request in admin panel and approves or declines
  4. On approval: guest receives email/SMS with payment link for 50% deposit
  5. On decline: guest receives polite notification that dates aren't available
- Verify each step works and there are no broken links in the chain
- Ensure the admin panel shows pending requests clearly
- Test edge cases: overlapping dates, same-day requests, request expiration

---

## 3. Additional Payment Methods Setup

**Current state:** Square credit card payments are working. Need to add alternative payment options for the booking deposit and balance payments.

**Payment methods to integrate:**
- **Bitcoin** — on-chain and/or Lightning Network
  - Consider BTCPay Server or similar self-hosted solution
  - Need to handle BTC price volatility (lock rate at time of invoice?)
- **Stablecoins** (USDC, USDT, etc.)
  - Consider Coinbase Commerce, BTCPay Server, or direct wallet integration
  - Specify which chains to support (Ethereum, Solana, Base, etc.)
- **Venmo** — Square or direct Venmo business integration
  - Could be manual (display Venmo handle + verification) or API-based
- **Cash App** — similar to Venmo, could use Square's Cash App Pay integration
  - Square SDK supports Cash App Pay via `payments.cashApp()` method
- **Zelle** — typically bank-to-bank, no API
  - Likely needs to be manual: display Zelle info, owner confirms receipt in admin panel

**Integration into booking pipeline:**
- After owner approves booking, guest selects payment method
- Each payment method needs:
  - Payment initiation (invoice/link generation)
  - Payment confirmation (webhook or manual verification)
  - Status update in booking system (pending → paid)
- All payment methods must work within the approval flow:
  Guest requests → Owner approves → Guest pays 50% → Booking confirmed

---

## 4. 30-Day Remaining Balance Reminder System

**Current state:** No automated reminder system exists for the remaining 50% balance.

**What needs to happen:**
- Build a scheduled job/cron that runs daily and checks for bookings where:
  - Check-in date is 30 days away (or approaching 30 days)
  - Only 50% deposit has been paid (remaining balance is due)
- On trigger, send the guest:
  - **Email** with remaining balance amount, payment link, and check-in date
  - **SMS/Text** with a shorter reminder and payment link
- Include in the notification:
  - Original booking details (dates, property, guest count)
  - Amount already paid (50% deposit)
  - Remaining balance due
  - Payment link (supporting all configured payment methods)
  - Deadline (must pay before check-in)
- Handle edge cases:
  - What if they don't pay by check-in? Send follow-up reminders at 14 days, 7 days?
  - What if check-in is less than 30 days from booking? Send immediately?
  - Owner notification if payment is overdue

---

## 5. Check-In/Welcome & Check-Out Information System

**Current state:** No automated system for sending guests their check-in or check-out information.

**What needs to happen:**

### Check-In / Welcome Package
- Build a system to send check-in information either:
  - **Automatically** — triggered X days before check-in (e.g., 3 days prior)
  - **Push-button** — owner clicks "Send check-in info" in admin panel
- Check-in information should include:
  - Property address and directions
  - Door code / lockbox code / smart lock access
  - Wi-Fi network name and password
  - House rules and quiet hours
  - Parking instructions
  - Local recommendations (restaurants, ski info, activities)
  - Emergency contact numbers
  - Trash/recycling schedule
  - Any seasonal notes (snow removal, fireplace instructions, etc.)
- Delivery via email + SMS (with link to full details)
- Template should be editable in admin panel

### Check-Out Information
- Send check-out information either automatically (morning of checkout) or via push button
- Check-out info should include:
  - Check-out time
  - Checklist (dishes, trash, thermostat, doors locked, etc.)
  - Where to leave keys (if applicable)
  - How to report any issues
  - Request for review/feedback (link to Google review, Airbnb review, etc.)
- Thank-you message with invitation to book again

### Admin Panel Features
- "Send check-in info" button per booking
- "Send check-out info" button per booking
- Status indicators: check-in info sent / not sent, check-out info sent / not sent
- Ability to edit templates for check-in and check-out messages
- Toggle between automatic and manual sending modes

---

## Recently Completed (for context)

- [x] Square payment integration working (sandbox tested end-to-end)
- [x] Social media marketing pipeline created
- [x] Blog post automation system
- [x] Admin panel with booking history
- [x] Photo library / web search integration
