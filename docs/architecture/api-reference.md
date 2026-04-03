# API Reference (Developer View)

Base URL:
- `https://<project-ref>.supabase.co/functions/v1/server`

## Public Routes

### System
- `GET /health`
- `GET /diagnostics`

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/reset-password`

### Webhooks
- `POST /webhooks/baridimob`
Required headers:
- `x-baridi-signature`
- `x-baridi-timestamp`

## Protected Routes

### Auth
- `POST /auth/update-password`
- `GET /auth/me`

### Tokens
- `GET /tokens`
- `POST /tokens/consume`
- `POST /tokens/purchase`
- `POST /tokens/baridimob/payment`
- `GET /tokens/history`
- `POST /tokens/upgrade`

### Posts
- `GET /posts`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

Posts validation contract:
- Allowed status values: `draft`, `scheduled`, `published`
- Allowed platforms: `Facebook`, `Instagram`, `LinkedIn`, `X`, `TikTok`, `YouTube`
- `POST /posts` requires:
	- `content` (string, non-empty, max 5000 chars)
	- `platforms` (non-empty array of allowed platform values)
	- Optional `status`, `time`, `image`, `date` (ISO date string)
- `PUT /posts/:id` accepts only:
	- `content`, `status`, `time`, `image`, `date`, `platforms`
	- `id` path parameter must be present and <= 128 chars
- Invalid payloads return `400`

### Settings
- `GET /settings`
- `PUT /settings`

Settings validation contract:
- Allowed fields only: `name`, `email`, `company`, `role`, `timezone`, `language`
- `PUT /settings` rules:
	- payload must be a non-empty JSON object
	- all values must be strings
	- unknown fields are rejected with `400`
	- `email` must be valid when provided and non-empty
	- max lengths: `name` 120, `email` 254, `company` 120, `role` 120, `timezone` 100, `language` 50
- `GET /settings` returns sanitized settings (allowed fields only)

### Accounts
- `GET /accounts`
- `POST /accounts`
- `DELETE /accounts/:id`

## Status Code Guidance

- 200 success
- 400 invalid request payload
- 401 unauthorized
- 402 business constraint (insufficient tokens)
- 404 resource not found
- 500 server error
- 503 dependency/secret missing

## Test Strategy

Use:
- `npm run test:api`

Optional authenticated checks:
- `API_TEST_EMAIL`
- `API_TEST_PASSWORD`

This validates both anonymous and authenticated route behavior.
