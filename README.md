
  # Social Media Management Dashboard

  This is a code bundle for Social Media Management Dashboard. The original project is available at https://www.figma.com/design/BpwBPC9Ucr1YxJJpWK5eVI/Social-Media-Management-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Backend setup

  Run `npm run test:api` to validate the deployed backend routes.

  Optional authenticated checks for API tests:

  On Windows PowerShell:

  `setx API_TEST_EMAIL "your-test-user@email.com"`

  `setx API_TEST_PASSWORD "your-strong-password"`

  Open a new terminal then run `npm run test:api`.

  See [docs/schema-evolution-plan.md](docs/schema-evolution-plan.md) for the normalized schema roadmap and KV migration strategy.

  ## Architecture docs (senior developer onboarding)

  Start here: [docs/architecture/README.md](docs/architecture/README.md)

  - Frontend and UI: [docs/architecture/frontend-ui.md](docs/architecture/frontend-ui.md)
  - Backend services: [docs/architecture/backend-services.md](docs/architecture/backend-services.md)
  - API reference: [docs/architecture/api-reference.md](docs/architecture/api-reference.md)
  - Database architecture: [docs/architecture/database.md](docs/architecture/database.md)
  - Social integrations: [docs/architecture/integrations-social.md](docs/architecture/integrations-social.md)
  - Operations runbook: [docs/architecture/runbook.md](docs/architecture/runbook.md)
  