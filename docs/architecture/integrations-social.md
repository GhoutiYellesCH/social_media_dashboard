# Social Integrations Architecture

## Supported Providers (Target)

- Meta (Facebook + Instagram)
- X
- LinkedIn
- YouTube

## Integration Principles

1. OAuth and token handling stays server-side.
2. Provider tokens are encrypted at rest.
3. UI never receives service credentials.
4. Publish and sync operations are async job-based.

## Core Integration Data Model

Primary table set:
- `social_connections`
- `social_pages` (or channels/business assets)
- `social_publish_jobs`
- `social_publish_results`
- `social_metrics_daily`
- `conversations`, `messages`, `mentions` (for inbox/listening)

## UI Mapping

Accounts UI:
- start/connect/disconnect provider accounts
- show account health and token expiry

Composer + Calendar:
- submit publish jobs per target provider/account
- display publish status and error feedback

Analytics:
- aggregate metrics by provider/content/time range

Inbox + Listening:
- consume provider webhooks into unified schemas

## Provider Notes

### Meta
- Use business OAuth flow.
- Support page and IG business account selection.
- Manage long-lived token lifecycle.

### X
- Use OAuth 2.0 with PKCE.
- Handle plan-dependent API limits and capabilities.

### LinkedIn
- Support user/org posting and analytics scopes.
- Include organization selection workflow after auth.

### YouTube
- OAuth via Google scopes.
- Channel linkage and analytics sync.

## Security and Reliability

- Encrypt provider tokens and rotate encryption keys.
- Rate-limit and retry wrapper around provider APIs.
- Idempotent publish execution with request reference keys.
- Redacted integration error logs for observability.

## Delivery Sequence

1. Social connection schema + encrypted secrets helper
2. OAuth start/callback endpoints (Meta first)
3. Publish job execution flow
4. Metrics sync jobs and analytics endpoints
5. Inbox/listening webhook ingestion
