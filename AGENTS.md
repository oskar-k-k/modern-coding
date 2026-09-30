# Modern Coding – project instructions

- Standalone neutral architecture presentation with Next.js frontend and no external login.
- Keep frontend/ and backend/ independent; documentation and launch scripts live at the root.
- Frontend uses the App Router and TypeScript. Table weights are subjective discussion aids, not research measurements.
- Java 21, Spring Boot 3.5.x, Maven Wrapper, JDBC, Flyway, embedded H2 PostgreSQL mode.
- The two main presentation files are ProfileController and ProfileService.
- Keep feature packages flat and SQL plus small response records near their use case.
- No mandatory JPA entities, repository wrappers, base controllers or base services.
- Use composition; ObjectStorage is a justified provider interface, not a reason to
  create an interface for every class. Local storage is a deliberately small demo.
- Keep demo bootstrap/security under platform; shared storage under core/storage.
- Parameterized SQL, authorization, transactions, CSRF and schema constraints stay.
- No real credentials or customer/product identifiers in code, fixtures or docs.
- Docker Compose publishes only 127.0.0.1:8085 by default and owns its own volume.
- Preserve portability: never depend on parent directories, local databases or IDE paths.
- README contains setup; PRESENTATION.md contains German speaking notes and tradeoffs.
- Do not claim AI makes ORM, tests, typing or abstraction obsolete.
- Run backend/ Maven Wrapper tests for backend changes; run frontend typecheck and build for frontend changes. Validate containers when Docker files change.
- Do not commit or push unless explicitly requested.
