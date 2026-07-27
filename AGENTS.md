# Project instructions for coding agents

## Sanity content work

Before answering questions about website uploads, event records, galleries, or
whether content should be edited or created:

1. Read `docs/sanity-content-operations.md`.
2. Run `pnpm sanity:checkpoint` (use `--from` and `--to` when a narrower date
   range is useful).
3. Treat the live Sanity dataset as the source of truth. Do not infer record
   existence from local files or an earlier chat.
4. Compare the request with both the live records and the local schemas in
   `sanity/schemas/` before recommending an edit, a new document, or a schema
   change.

The checkpoint command is deliberately read-only and must remain so. Never
print environment-variable values or credentials. Do not attempt a Sanity
mutation unless the user explicitly requests it and write access is confirmed.
