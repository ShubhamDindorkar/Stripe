# Stripe API Status Panel, Screen State Contract

What the status feed panel puts on screen in each condition it can be in, agreed before any fetch code was written.

## Surface

This contract covers one region only: the status feed panel on `/status`, which loads the captured feed from `data/status-feed.json`.

Labelled layout sketch: `Stripe API Status Panel — Layout Sketch.txt`

---

## State: waiting on data

While the feed request is still in flight, the panel shows the headline "Stripe API Status" and ten grey skeleton placeholder bars beneath it — one bar for the overall status line, four bars for the incident rows, five bars for the changelog rows — sitting exactly where the real text will land. No spinner. No "Loading…" text. No count.

**Button:** none.

Occupies the shared panel box at full height and the same top position, so nothing on the page shifts when the real content arrives.

---

## State: no active incidents

When the request comes back and `overall_status` is `operational` with an empty `incidents` array, the panel shows the headline "Stripe API Status", the body line "All systems operational.", and the body line "Nothing to report." beneath it. No error colour. No warning icon. No retry prompt.

**Button:** none.

Occupies the shared panel box at full height, at the same size and position as the other three states. This state is a successful result and must not use the network-failure headline, body copy, or button.

---

## State: active service disruption

When the request comes back and `overall_status` is not `operational` or the `incidents` array has one or more entries, the panel shows the headline "Stripe API Status", the body line "Overall status: degraded." where the status word is the value of `overall_status` from the feed, the active incident rows listed with title, impact, status, and time since last update, and the changelog entries listed with title and published date. Each incident row shows its title, its impact label, its status, and how long ago it was last updated, for example "Elevated error rates on card authorisations in EU · major · identified · 3 minutes ago". An incident whose impact is `major` shows the impact label in red. Beneath each incident title row the panel shows that incident's `latest_update` text on its own line.

**Button:** "View changelog".

Pressing "View changelog" opens `https://docs.stripe.com/changelog` in a new browser tab; nothing inside the panel changes.

Occupies the shared panel box at full height, at the same size and position as the other three states.

---

## State: network failure

When the request does not come back, the panel shows the headline "Couldn't load status feed" and the body line "This panel couldn't reach the status feed. Stripe services are unaffected."

**Button:** "Retry".

Pressing "Retry" requests the status feed again and moves the panel straight back into the waiting-on-data state, then into no active incidents or active service disruption depending on the result; it must not reload the page and must not print anything to the browser console.

Occupies the shared panel box at full height, at the same size and position as the other three states.

---

## Layout box

All four states render inside one box: full column width, minimum height 480px, same top position on `/status`. The box is never removed from the page and never resized between states. During the wait it is filled by the ten skeleton placeholder bars, so the panel is never blank and the content below it never jumps. The no-active-incidents state keeps the same row-area height as the active-service-disruption state even when the content area holds only the body line "Nothing to report."
