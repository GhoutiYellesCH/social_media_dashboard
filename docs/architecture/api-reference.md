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

### Settings
- `GET /settings`
- `PUT /settings`

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
