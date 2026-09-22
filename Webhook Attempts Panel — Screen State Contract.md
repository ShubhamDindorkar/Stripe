# Webhook Attempts Panel, Screen State Contract

What the "Recent webhook attempts" panel puts on screen in each condition it can be in, agreed before any fetch code was written.

## Surface

This contract covers one region only: the "Recent webhook attempts" panel on the webhooks reference page in Stripe Docs, which loads the last five delivery attempts for the endpoint the signed-in reader has selected.

## State: loading

While the attempts request is still in flight, the panel shows the heading "Recent webhook attempts" and five skeleton rows beneath it, grey placeholder bars sitting exactly where the attempt text will land. No spinner, no "Loading…" text, no count.
Button: none.
Occupies the shared panel box at full height and the same top position, so nothing on the page shifts when the real rows arrive.

## State: populated

The panel shows the heading "Recent webhook attempts" with the rows listed newest first. Each row shows the event type, the response status code the endpoint returned, and how long ago the attempt was made, for example `payment_intent.succeeded · 200 · 4 minutes ago`. A row whose status code is not in the 200s shows the code in red and adds the words "will retry".
Button: "View all attempts", a secondary text button under the last row. Pressing it opens the endpoint's full attempt log in the Stripe Dashboard in a new browser tab; nothing inside the panel changes.
Occupies the shared panel box at full height, at the same size and position as the loading state.

## State: failed

When the request does not come back, the panel shows the headline "Couldn't load recent attempts" and beneath it the sentence "This panel couldn't reach the API. Your webhook endpoint is unaffected."
Button: "Retry".
Pressing "Retry" requests the attempts again and moves the panel straight back into the loading state, then into populated or failed depending on the result; it must not reload the page and must not print anything to the browser console.
Occupies the shared panel box at full height, at the same size and position as the other two states.

## Layout box

All three states render inside one box: full column width, minimum height 280px, same top position under the "Testing webhooks" section. The box is never removed from the page and never resized between states. During the wait it is filled by the five skeleton rows, so the panel is never blank and the content below it never jumps.

## Sketch

```
┌─ PANEL BOX ─ full column width, min-height 280px ─────────────┐
│                                                               │
│  HEADING ROW                                                  │
│  "Recent webhook attempts"                                    │
│  ─────────────────────────────────────────────────────────    │
│                                                               │
│  ROW AREA (5 rows, same height in every state)                │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭    ← skeleton placeholder row 1      │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭         ← skeleton placeholder row 2      │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭      ← skeleton placeholder row 3      │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭         ← skeleton placeholder row 4      │
│  ▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭▭        ← skeleton placeholder row 5      │
│                                                               │
│  (populated: real attempt rows land here, same positions)     │
│  (failed: headline + sentence sit centred in this same area)  │
│                                                               │
│  ─────────────────────────────────────────────────────────    │
│  BUTTON SLOT   populated → "View all attempts"                │
│                failed    → "Retry"                            │
│                loading   → empty, height reserved             │
└───────────────────────────────────────────────────────────────┘