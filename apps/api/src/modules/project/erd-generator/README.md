# ERD Generator Module

Module untuk membuat Entity Relationship Diagram (ERD) secara otomatis dari deskripsi teks menggunakan AI.

## Endpoints

### Projects

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/erd/projects` | Yes | List projects (paginated, filtered, searchable) |
| GET | `/erd/projects/:id` | Yes | Get project detail + schema |
| POST | `/erd/projects` | Yes | Create project |
| PATCH | `/erd/projects/:id` | Yes | Update project |
| DELETE | `/erd/projects/:id` | Yes | Soft delete (trash) |
| POST | `/erd/projects/:id/restore` | Yes | Restore from trash |
| DELETE | `/erd/projects/:id/permanent` | Yes | Permanent delete |

### AI Generate

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/erd/generate` | Yes* | Generate ERD from text (non-streaming) |
| POST | `/erd/generate/stream` | Yes* | Generate ERD from text (streaming SSE) |
| GET | `/erd/usage` | Yes | Check quota usage |

*Guest: 1x generate, User: quota based on plan

### Export

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/erd/export` | No | Export schema to SQL/Prisma |

### Share & Collaboration

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/erd/projects/:id/share` | Yes | List collaborators |
| POST | `/erd/projects/:id/share` | Yes | Invite collaborator |
| DELETE | `/erd/projects/:id/share/:userId` | Yes | Remove collaborator |
| PATCH | `/erd/projects/:id/share/:userId` | Yes | Update role |
| GET | `/erd/projects/:id/share/link` | Yes | Get share link |
| POST | `/erd/projects/:id/share/link` | Yes | Generate share link |
| GET | `/erd/share/:link` | No | Get project by link (public) |

### Version History

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/erd/projects/:id/history` | Yes | List versions |
| POST | `/erd/projects/:id/history` | Yes | Save version |
| GET | `/erd/projects/:id/history/:versionId` | Yes | Get version detail |
| POST | `/erd/projects/:id/history/:versionId/restore` | Yes | Restore version |

### Templates

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/erd/templates` | No | List templates |
| GET | `/erd/templates/:id` | No | Get template detail |
| POST | `/erd/templates/:id/use` | Yes | Create project from template |

### Billing

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/erd/billing` | Yes | Get billing info |
| POST | `/erd/billing/upgrade` | Yes | Request upgrade |
| POST | `/erd/billing/cancel` | Yes | Cancel subscription |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/stats` | Admin | Dashboard stats |
| GET | `/admin/users` | Admin | List users |
| GET | `/admin/users/:id` | Admin | User detail |
| PATCH | `/admin/users/:id` | Admin | Update user role |
| DELETE | `/admin/users/:id` | Admin | Delete user |
| GET | `/admin/projects` | Admin | List projects |
| GET | `/admin/payments` | Admin | List payments |
| POST | `/admin/payments/:id/verify` | Admin | Verify payment |
| POST | `/admin/payments/:id/reject` | Admin | Reject payment |

## Structure

```
erd-generator/
├── index.ts                          # Mount all controllers
├── controllers/
│   ├── project.controller.ts         # Project CRUD
│   ├── schema.controller.ts          # AI generate + quota
│   ├── export.controller.ts          # Export SQL/Prisma
│   ├── billing.controller.ts         # Billing + upgrade
│   ├── share.controller.ts           # Share + collaboration
│   ├── history.controller.ts         # Version history
│   ├── template.controller.ts        # Templates
│   └── admin.controller.ts           # Admin endpoints
├── services/
│   ├── ai.service.ts                 # Groq + Gemini, key rotation
│   ├── project.service.ts            # Project CRUD logic
│   ├── schema.service.ts             # Generate schema via AI
│   ├── quota.service.ts              # Quota tracking
│   ├── billing.service.ts            # Billing + payment
│   ├── share.service.ts              # Share + collaboration
│   ├── history.service.ts            # Version history
│   ├── template.service.ts           # Templates
│   └── export.service.ts             # Export SQL/Prisma
├── validations/
│   ├── project.validation.ts         # Project schemas
│   ├── schema.validation.ts          # Generate schemas
│   ├── export.validation.ts          # Export schemas
│   ├── billing.validation.ts         # Billing schemas
│   ├── share.validation.ts           # Share schemas
│   └── history.validation.ts         # History schemas
├── helpers/
│   ├── project.helper.ts             # Project access check, pagination
│   └── export.helper.ts              # Type mapping, format helpers
└── prompts/
    └── generate-erd.prompt.ts        # AI prompt templates
```

## Quota System

| Plan | Generate/month | Projects | Price |
|------|---------------|----------|-------|
| Free | 10 | 5 | Gratis |
| Pro | Unlimited | Unlimited | Rp 99.000/bulan |
| Team | Unlimited | Unlimited | Rp 299.000/bulan |

**Custom API key:** Unlimited, tidak kena quota (disimpan di localStorage).

## AI Providers

- **Groq** (default) — `llama-3.3-70b-versatile`
- **Gemini** — `gemini-2.0-flash`
- Key rotation: round-robin, max 3 retries

## Export Formats

- **SQL DDL** — MySQL, PostgreSQL, SQLite
- **Prisma Schema** — Standard Prisma format
