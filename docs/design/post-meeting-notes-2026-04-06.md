# Post-Meeting Strategic Notes — 2026-04-06

Notes from the post-meeting discussion with Rocco. These are strategic direction
items for future presentations and the next planning session — not specs.

## Smart Modeling (future feature)

Use equipment degradation forecasts to predict long-term LP constraints before
they appear. Specifically: heat transfer coefficients on exchangers, fouling
rates, and similar slow-moving equipment health signals.

The analytics layer could be built in Seeq (potential partnership) or directly
in Python.

End-to-end flow:

1. Planner inputs a long-term scenario (crude slate, rate, etc.)
2. Equipment forecast model predicts when constraints will hit
3. LP model is updated with the forecasted constraint timing
4. Planner sees a more realistic forecast that accounts for degradation

Strategic value: turns the LP model from a "today's snapshot" tool into a
forward-looking planning tool that knows when its own assumptions will break.

## Operator Chatbot Interface (future feature)

Goal: a chatbot in Microsoft Teams that operators interact with directly.
Per-unit recommendations push to the operator's Teams chat instead of
requiring them to log into the dashboard.

This was mentioned on a slide in the original deck — the interaction model
is "meet the operator where they already work" rather than adding another
tool to their stack.

## Automated Constraint Detection (capability gap)

The product should automatically pick up market shifts and re-run the LP
model. Triggers include:

- Crude slate price changes
- Product price changes
- Natural gas pricing

Current state: the wizard only supports manual constraint entry — a planner
has to notice the shift and run a new scenario themselves.

Gap: there's no ingestion + auto-rerun loop. This is a planned automation,
not a ship-blocker for the demo, but it's a clear capability gap to call
out in future positioning.

## Automated Drift Detection + Operator Q&A (future feature)

When the system detects a unit feed has dropped, the bot should ask
operations *why*.

- If the answer is a fixable process constraint → feed it into the model and
  re-run. The LP picks up the new reality.
- If the answer is an emergency / unit upset → exclude the deviation from
  "missed opportunity" loss tracking. Operators didn't have a choice, so
  it shouldn't count against them in the loss attribution.

Strategic value: closes the loop between LP recommendations and operator
reality, and avoids the trust-killing failure mode of blaming operators
for losses they couldn't have prevented.
