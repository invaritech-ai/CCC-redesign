# Charity Golf Day 2026 Design

## Goal

Add a time-bound Charity Golf Day promotion without displacing the existing redevelopment message.

## Recommended Placement

The homepage should keep the current redevelopment banner as the first announcement. Directly below it, add a slimmer Golf Day strip with the campaign copy and an external "Find out more" action. This keeps the redevelopment context primary while giving the event immediate visibility.

The global navigation should add "Golf Day 2026" under "Get Involved", placed after "Donate". This matches the event's fundraising and sponsorship purpose, and makes the link available from every page without adding another site-wide banner.

## Design Notes

The strip should be compact, warm, and action-oriented. It should use the site's existing green and fawn palette, a golf-related icon or supplied emoji, and an external-link-safe anchor to `https://cccgolfday.sparkraise.com/`.

Desktop and mobile navigation should both support the external item. External links should open in a new tab with `rel="noopener noreferrer"`.

## Validation

Add a small source-level regression script because this project does not currently define a unit test runner. Then run the script, lint, and production build.
