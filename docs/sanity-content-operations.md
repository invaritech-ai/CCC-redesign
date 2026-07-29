# Sanity content operations handoff

This note is the durable starting point for website-content requests. Live
Sanity content can change between sessions, so verify it with the checkpoint
command before giving the user an action list.

## Fast checkpoint

```bash
pnpm sanity:checkpoint
pnpm sanity:checkpoint -- --from 2026-07-01 --to 2026-11-01
```

The command reads the configured dataset without a token, reports document
counts, and lists events in the requested date window. It does not write to
Sanity. Configuration comes from `.env.local` or `.env`; do not print those
values in chat or logs.

## Content model relevant to upload requests

- `event` is the established content type for scheduled activities. An event
  has a title, slug, date, optional display time, plain-text description, one
  main image, location, registration link, category, one organizer object, and
  a featured flag.
- An event cannot hold two independent images. For a post-event request that
  supplies multiple collages, use the sender's stated fallback/priority image
  or identify that a schema/product change is required.
- `gallery` supports multiple captioned images. However, the production dataset
  had zero gallery documents at the 27 July 2026 checkpoint, so do not assume a
  new gallery is the established workflow. Recommend one only when the user
  intentionally wants to introduce that content pattern.
- Event pages are rendered at
  `/care-community/activities-and-events/:slug`; published events also appear
  in the activities listing/archive.

## How to classify a content request

1. Match each requested item against live events using both date and title.
2. If it exists, recommend editing that document; do not create a duplicate.
3. If it does not exist, recommend creating a new event from the supplied
   flyer/details.
4. Derive a new event title from both the flyer and recent comparable live
   titles. The established pattern is `Event name (Free/price)`. Append
   `Refreshments provided` when the flyer says refreshments are included. For
   example: `Chair Yoga (Free) Refreshments provided`. Retain `(Free)` even when
   the flyer phrases it as “free entry” or “free of charge”. Do not add the
   refreshments suffix when the flyer does not offer refreshments.
5. Present event date/time values as `YYYY-MM-DD HH:mm`, interpreted in Hong
   Kong local time unless another timezone is explicitly provided. Example:
   `2026-07-29 10:15`.
6. A post-event collage normally replaces the event's flyer as its single main
   image. Put captions, thanks, feedback, and extra credits in the description
   because the current event model has no dedicated fields for them.
7. For a “registration is full” request, edit the existing event. Put the
   notice prominently at the start of the description and remove a registration
   link if one exists. Preserve other useful details unless the sender clearly
   requests replacement.
8. Do not guess malformed contact details, unclear symbols, missing dates, or
   where unattached photos belong. List those as explicit clarifications.

## Verified checkpoint: 27 July 2026

Read access to the `production` dataset was confirmed. Write access is blocked.
At this checkpoint there were 151 documents, including 32 events and zero
galleries.

The following requested records already existed and should be edited:

- 8 July 2026 — `Chat & Chill Party (Free) Refreshments provided`
- 22 July 2026 — `Chair Yoga (Free) Refreshments provided`
- 5 August 2026 — `Healing Strings Harp Therapy (Free) Refreshments provided`
- 19 August 2026 — `Tai Chi for Wellness (Free) Refreshments provided`

No September or October 2026 events existed. For the July/August upload request
received on 27 July, the resulting action list was therefore:

- Edit the two July events with their post-event collage/copy.
- Edit the two August events with the registration-full notice.
- Create two September events and one October event from their flyers.
- Hold Tiffany's separate photos until the target event/page is identified;
  no live document matched “Tiffany”.

This dated section is historical context only. Re-run the checkpoint before
using it in a later session.

The copy-ready field values and asset paths for this request are recorded in
`docs/content-updates/2026-07-website-upload.md`.
