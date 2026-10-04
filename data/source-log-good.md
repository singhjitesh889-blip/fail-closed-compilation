# Session log — healthy source format

RULE: Always validate input length before processing
RULE: Retry transient network errors up to 3 times
RULE: Log the request ID on every error path
RULE: Never trust a client-supplied timestamp for ordering
RULE: Close database connections in a finally block
RULE: Cache invalidation must happen before the write, not after
RULE: Rate limits apply per API key, not per IP
