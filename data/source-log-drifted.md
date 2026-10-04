# Session log — format drifted upstream (the real-world failure mode)

Someone changed the logging convention without updating the extractor.
Most entries below are real rules, but they no longer match the `RULE:`
prefix the extractor looks for, so from the extractor's point of view
this source is nearly empty.

- Always validate input length before processing
- Retry transient network errors up to 3 times
- Log the request ID on every error path
- Never trust a client-supplied timestamp for ordering
- Close database connections in a finally block

RULE: Cache invalidation must happen before the write, not after
