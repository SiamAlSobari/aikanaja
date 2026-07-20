# Graph Report - .  (2026-07-20)

## Corpus Check
- 216 files · ~73,679 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 736 nodes · 1137 edges · 58 communities (47 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Account Page|Account Page]]
- [[_COMMUNITY_API Key Controller|API Key Controller]]
- [[_COMMUNITY_ERD Generator Package|ERD Generator Package]]
- [[_COMMUNITY_API Key Service|API Key Service]]
- [[_COMMUNITY_Flow Store|Flow Store]]
- [[_COMMUNITY_Export Controller|Export Controller]]
- [[_COMMUNITY_UI Store|UI Store]]
- [[_COMMUNITY_AI API Package|AI API Package]]
- [[_COMMUNITY_Agent Configuration|Agent Configuration]]
- [[_COMMUNITY_Root Package|Root Package]]
- [[_COMMUNITY_Date Helper & Billing|Date Helper & Billing]]
- [[_COMMUNITY_AI Chat Components|AI Chat Components]]
- [[_COMMUNITY_ERD API Client|ERD API Client]]
- [[_COMMUNITY_Admin & Billing Pages|Admin & Billing Pages]]
- [[_COMMUNITY_Auth & Landing Pages|Auth & Landing Pages]]
- [[_COMMUNITY_Project Helper|Project Helper]]
- [[_COMMUNITY_Admin Dashboard|Admin Dashboard]]
- [[_COMMUNITY_ERD Generator Config|ERD Generator Config]]
- [[_COMMUNITY_API Key & Auth Service|API Key & Auth Service]]
- [[_COMMUNITY_History Service|History Service]]
- [[_COMMUNITY_Settings Pages|Settings Pages]]
- [[_COMMUNITY_API Config & Auth|API Config & Auth]]
- [[_COMMUNITY_API TypeScript Config|API TypeScript Config]]
- [[_COMMUNITY_Shared Package Index|Shared Package Index]]
- [[_COMMUNITY_Auth Store|Auth Store]]
- [[_COMMUNITY_Google Auth Service|Google Auth Service]]
- [[_COMMUNITY_Admin API|Admin API]]
- [[_COMMUNITY_Auth API|Auth API]]
- [[_COMMUNITY_Dashboard Projects|Dashboard Projects]]
- [[_COMMUNITY_Schema Transform & Canvas|Schema Transform & Canvas]]
- [[_COMMUNITY_Shared Package Exports|Shared Package Exports]]
- [[_COMMUNITY_ERD Types|ERD Types]]
- [[_COMMUNITY_Quota Store|Quota Store]]
- [[_COMMUNITY_Assets & Layout|Assets & Layout]]
- [[_COMMUNITY_Gemini Settings|Gemini Settings]]
- [[_COMMUNITY_Prisma Seed|Prisma Seed]]
- [[_COMMUNITY_Auth Service|Auth Service]]
- [[_COMMUNITY_Admin Controller|Admin Controller]]
- [[_COMMUNITY_Chat Service|Chat Service]]
- [[_COMMUNITY_Template Service|Template Service]]
- [[_COMMUNITY_New Project Store|New Project Store]]
- [[_COMMUNITY_Utils Constants|Utils Constants]]
- [[_COMMUNITY_Example Controller|Example Controller]]
- [[_COMMUNITY_Lib Config|Lib Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_XYFlow Svelte|XYFlow Svelte]]

## God Nodes (most connected - your core abstractions)
1. `getApiUrl()` - 60 edges
2. `$lib/api/erd` - 28 edges
3. `$lib/stores/ui.store.svelte` - 18 edges
4. `PRD - AiKanAja ERD Generator` - 18 edges
5. `prisma` - 16 edges
6. `checkProjectAccess()` - 15 edges
7. `compilerOptions` - 13 edges
8. `Todo Backend` - 13 edges
9. `pushSnapshot()` - 12 edges
10. `authMiddleware()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ExportRequest` --references--> `ErdSchema`  [EXTRACTED]
  apps/erd-generator/src/lib/api/erd.ts → packages/shared/src/index.ts
- `Template` --references--> `ErdSchema`  [EXTRACTED]
  apps/erd-generator/src/lib/api/erd.ts → packages/shared/src/index.ts
- `Version` --references--> `ErdSchema`  [EXTRACTED]
  apps/erd-generator/src/lib/api/erd.ts → packages/shared/src/index.ts
- `ERD Generator AGENTS.md` --EXTRACTED--> `Todo Frontend`  [EXTRACTED]
  apps/erd-generator/AGENTS.md → docs/erd-generator/todo-frontend.md
- `ERD Generator GEMINI.md` --EXTRACTED--> `Todo Frontend`  [EXTRACTED]
  apps/erd-generator/GEMINI.md → docs/erd-generator/todo-frontend.md

## Import Cycles
- None detected.

## Communities (58 total, 11 thin omitted)

### Community 0 - "Account Page"
Cohesion: 0.05
Nodes (40): actions, load(), load(), load(), load(), BillingInfo, actions, load() (+32 more)

### Community 1 - "API Key Controller"
Cohesion: 0.06
Nodes (42): apiKeyController, apiKeyService, providerEnum, activityController, activityService, billingController, billingService, chatController (+34 more)

### Community 2 - "ERD Generator Package"
Cohesion: 0.05
Nodes (41): dependencies, @aikanaja/shared, daisyui, @humanspeak/svelte-motion, lucide-svelte, @xyflow/svelte, devDependencies, eslint (+33 more)

### Community 3 - "API Key Service"
Cohesion: 0.08
Nodes (18): ApiKeyService, maskKey(), buildGeneratePrompt(), ActivityService, AiService, Attempt, buildAttemptList(), createAiProvider() (+10 more)

### Community 4 - "Flow Store"
Cohesion: 0.08
Nodes (27): addColumnToTable(), addEdge(), addNode(), beginChange(), deleteColumnFromTable(), deleteEdge(), deleteNode(), edges (+19 more)

### Community 5 - "Export Controller"
Cohesion: 0.11
Nodes (20): exportController, exportService, formatDefault(), mapColumnType(), SqlTarget, toCamelCase(), toPascalCase(), toPrismaDefault() (+12 more)

### Community 6 - "UI Store"
Cohesion: 0.09
Nodes (19): appearance, AppearancePrefs, applyDom(), CanvasBg, DEFAULT_APPEARANCE, DEFAULT_NOTIFICATIONS, FontSize, NotificationPrefs (+11 more)

### Community 7 - "AI API Package"
Cohesion: 0.08
Nodes (24): dependencies, ai, @ai-sdk/google, @ai-sdk/groq, dotenv, elysia, @elysia/cors, elysia-http-exception (+16 more)

### Community 8 - "Agent Configuration"
Cohesion: 0.16
Nodes (25): API AGENTS.md, ERD Generator AGENTS.md, ERD Generator GEMINI.md, ERD Generator README.md, ERD Generator Docs README, PRD - AiKanAja ERD Generator, Todo Backend, Todo Frontend (+17 more)

### Community 9 - "Root Package"
Cohesion: 0.08
Nodes (22): devDependencies, turbo, name, packageManager, private, scripts, build, check (+14 more)

### Community 10 - "Date Helper & Billing"
Cohesion: 0.14
Nodes (8): getCurrentMonth(), BillingInfo, BillingService, PAYMENT_INFO, PLAN_LIMITS, PlanTier, QuotaInfo, QuotaService

### Community 11 - "AI Chat Components"
Cohesion: 0.17
Nodes (12): $lib/components/features/ai/AIChatPanel.svelte, $lib/stores/flow.store.svelte, $lib/types/erd, $lib/utils/constants, $lib/utils/project, ./ColumnEditor.svelte, ./RelationEditor.svelte, currentType (+4 more)

### Community 12 - "ERD API Client"
Cohesion: 0.15
Nodes (14): $lib/api/erd, ChatMessage, Collaborator, erdApi, ExportRequest, ExportResponse, ListProjectsParams, Payment (+6 more)

### Community 13 - "Admin & Billing Pages"
Cohesion: 0.13
Nodes (4): cancelling, $lib/api/erd, $lib/stores/auth.store.svelte, $app/navigation

### Community 14 - "Auth & Landing Pages"
Cohesion: 0.20
Nodes (15): $lib/components/landing/ComparisonSection.svelte, $lib/components/landing/CTASection.svelte, $lib/components/landing/ExportPlayground.svelte, $lib/components/landing/FAQAccordion.svelte, $lib/components/landing/FeaturesGrid.svelte, $lib/components/landing/HeroSection.svelte, $lib/components/landing/OrbitIntegrator.svelte, $lib/components/landing/WorkflowStepper.svelte (+7 more)

### Community 15 - "Project Helper"
Cohesion: 0.15
Nodes (8): buildProjectWhereClause(), fetchProjectAsOwner(), normalizePagination(), activityService, ListProjectsOptions, PROJECT_SELECT, PROJECT_SELECT_WITH_SCHEMA, ProjectService

### Community 16 - "Admin Dashboard"
Cohesion: 0.24
Nodes (3): $lib/components/features/admin/AdminHeader.svelte, $lib/api/admin, $app/state

### Community 17 - "ERD Generator Config"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, baseUrl, checkJs, esModuleInterop, forceConsistentCasingInFileNames, moduleResolution, paths (+7 more)

### Community 18 - "API Key & Auth Service"
Cohesion: 0.24
Nodes (6): ApiKeyView, ListProjectsOptions, adapter, prisma, LogActivityParams, activityService

### Community 19 - "History Service"
Cohesion: 0.23
Nodes (3): checkProjectAccess(), HistoryService, ShareService

### Community 20 - "Settings Pages"
Cohesion: 0.19
Nodes (4): $lib/api/client, $lib/stores/ui.store.svelte, $lib/types/user, $app/forms

### Community 21 - "API Config & Auth"
Cohesion: 0.18
Nodes (8): config, authController, authService, googleService, LoginBody, RegisterBody, authModule, resolveFrontend()

### Community 22 - "API TypeScript Config"
Cohesion: 0.20
Nodes (9): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, skipLibCheck, strict, target (+1 more)

### Community 23 - "Shared Package Index"
Cohesion: 0.20
Nodes (9): ApiResponse, ErdColumn, ErdProject, GenerateSchemaRequest, GenerateSchemaResponse, PaginatedResponse, PlanTier, RelationType (+1 more)

### Community 24 - "Auth Store"
Cohesion: 0.20
Nodes (4): User, isAuthenticated, isLoading, user

### Community 25 - "Google Auth Service"
Cohesion: 0.22
Nodes (4): ADMIN_EMAILS, GoogleService, GoogleTokenResponse, GoogleUserInfo

### Community 26 - "Admin API"
Cohesion: 0.25
Nodes (7): adminApi, AdminPayment, AdminProject, AdminRole, AdminStats, AdminUser, Paginated

### Community 27 - "Auth API"
Cohesion: 0.29
Nodes (5): authApi, AuthResponse, GoogleAuthResponse, User, api

### Community 28 - "Dashboard Projects"
Cohesion: 0.29
Nodes (5): $lib/stores/new-project.store.svelte, svelte/easing, $lib/components/features/project/NewProjectModal.svelte, $lib/components/features/project/ProjectCard.svelte, $lib/components/ui/Sparkline.svelte

### Community 29 - "Schema Transform & Canvas"
Cohesion: 0.32
Nodes (4): $lib/utils/schema-transform, ./CanvasControls.svelte, $lib/components/flow/ERDCanvas.svelte, @xyflow/svelte/dist/style.css

### Community 30 - "Shared Package Exports"
Cohesion: 0.25
Nodes (7): exports, main, name, private, type, types, version

### Community 31 - "ERD Types"
Cohesion: 0.29
Nodes (3): ErdRelation, ErdTable, COLUMN_TYPE_COLORS

### Community 33 - "Assets & Layout"
Cohesion: 0.40
Nodes (4): $lib/assets/favicon.svg, $lib/stores/quota.store.svelte, ./layout.css, $lib/components/QuotaExceededModal.svelte

### Community 34 - "Gemini Settings"
Cohesion: 0.40
Nodes (4): mcpServers, svelte, $schema, url

### Community 35 - "Prisma Seed"
Cohesion: 0.40
Nodes (3): adapter, prisma, templates

### Community 41 - "Utils Constants"
Cohesion: 0.50
Nodes (3): COLUMN_TYPES, DB_TARGETS, RELATION_TYPES

## Knowledge Gaps
- **238 isolated node(s):** `name`, `version`, `dev`, `db:migrate`, `db:generate` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `$lib/api/erd` connect `ERD API Client` to `Account Page`, `Admin & Billing Pages`, `Shared Package Index`, `Auth API`, `Dashboard Projects`, `Schema Transform & Canvas`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `lucide-svelte` connect `ERD Generator Package` to `Admin Dashboard`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getApiUrl()` (e.g. with `load()` and `load()`) actually correct?**
  _`getApiUrl()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `dev` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Account Page` be split into smaller, more focused modules?**
  _Cohesion score 0.05086071987480438 - nodes in this community are weakly interconnected._
- **Should `API Key Controller` be split into smaller, more focused modules?**
  _Cohesion score 0.05658381808566896 - nodes in this community are weakly interconnected._
- **Should `ERD Generator Package` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._