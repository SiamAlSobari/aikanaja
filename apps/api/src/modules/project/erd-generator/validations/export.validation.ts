import { t } from 'elysia'

// Column schema
const ErdColumnSchema = t.Object({
  id: t.String(),
  name: t.String(),
  type: t.String(),
  primaryKey: t.Boolean(),
  nullable: t.Boolean(),
  unique: t.Boolean(),
  defaultValue: t.Union([t.String(), t.Null()]),
  foreignKey: t.Union([
    t.Object({ table: t.String(), column: t.String() }),
    t.Null(),
  ]),
})

// Table schema
const ErdTableSchema = t.Object({
  id: t.String(),
  name: t.String(),
  position: t.Object({ x: t.Number(), y: t.Number() }),
  columns: t.Array(ErdColumnSchema),
})

// Relation schema
const ErdRelationSchema = t.Object({
  id: t.String(),
  sourceTableId: t.String(),
  targetTableId: t.String(),
  sourceColumn: t.String(),
  targetColumn: t.String(),
  type: t.Union([
    t.Literal('one-to-one'),
    t.Literal('one-to-many'),
    t.Literal('many-to-many'),
  ]),
})

// POST /erd/export — Export body
export const ExportBody = t.Object({
  schema: t.Object({
    tables: t.Array(ErdTableSchema),
    relations: t.Array(ErdRelationSchema),
  }),
  format: t.Union([t.Literal('sql'), t.Literal('prisma')]),
  target: t.Optional(t.Union([
    t.Literal('mysql'),
    t.Literal('postgresql'),
    t.Literal('sqlite'),
  ])),
})
