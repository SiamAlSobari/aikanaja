/**
 * Type mapping untuk SQL DDL generation per database target.
 */

type SqlTarget = 'mysql' | 'postgresql' | 'sqlite'

export const TYPE_MAP: Record<SqlTarget, Record<string, string>> = {
  mysql: {
    UUID: 'CHAR(36)',
    VARCHAR: 'VARCHAR',
    TEXT: 'TEXT',
    INT: 'INT',
    INTEGER: 'INT',
    BIGINT: 'BIGINT',
    FLOAT: 'FLOAT',
    DECIMAL: 'DECIMAL',
    BOOLEAN: 'TINYINT(1)',
    DATE: 'DATE',
    DATETIME: 'DATETIME',
    TIMESTAMP: 'TIMESTAMP',
    JSON: 'JSON',
    BLOB: 'BLOB',
  },
  postgresql: {
    UUID: 'UUID',
    VARCHAR: 'VARCHAR',
    TEXT: 'TEXT',
    INT: 'INTEGER',
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    FLOAT: 'REAL',
    DECIMAL: 'DECIMAL',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    DATETIME: 'TIMESTAMP',
    TIMESTAMP: 'TIMESTAMP',
    JSON: 'JSONB',
    BLOB: 'BYTEA',
  },
  sqlite: {
    UUID: 'TEXT',
    VARCHAR: 'TEXT',
    TEXT: 'TEXT',
    INT: 'INTEGER',
    INTEGER: 'INTEGER',
    BIGINT: 'INTEGER',
    FLOAT: 'REAL',
    DECIMAL: 'REAL',
    BOOLEAN: 'INTEGER',
    DATE: 'TEXT',
    DATETIME: 'TEXT',
    TIMESTAMP: 'TEXT',
    JSON: 'TEXT',
    BLOB: 'BLOB',
  },
}

/** Map column type ke target database type */
export function mapColumnType(type: string, target: SqlTarget): string {
  const baseType = type.toUpperCase().replace(/\(.*\)/, '')
  return TYPE_MAP[target][baseType] || type.toUpperCase()
}

/** Format default value untuk target database */
export function formatDefault(value: string, target: SqlTarget): string {
  if (value === 'CURRENT_TIMESTAMP') {
    return target === 'mysql' ? 'CURRENT_TIMESTAMP' : 'NOW()'
  }
  if (value === 'true') return target === 'sqlite' ? '1' : 'true'
  if (value === 'false') return target === 'sqlite' ? '0' : 'false'
  if (!isNaN(Number(value))) return value
  return `'${value}'`
}

/** Convert snake_case ke PascalCase */
export function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/** Convert snake_case ke camelCase */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/** Map column type ke Prisma type */
export function toPrismaType(type: string): string {
  const upper = type.toUpperCase()
  if (upper.includes('UUID') || upper.includes('VARCHAR') || upper.includes('TEXT')) return 'String'
  if (upper.includes('INT') || upper.includes('BIGINT')) return 'Int'
  if (upper.includes('FLOAT') || upper.includes('DECIMAL') || upper.includes('REAL')) return 'Float'
  if (upper.includes('BOOLEAN')) return 'Boolean'
  if (upper.includes('DATE') || upper.includes('TIMESTAMP') || upper.includes('DATETIME')) return 'DateTime'
  if (upper.includes('JSON')) return 'Json'
  return 'String'
}

/** Map default value ke Prisma default */
export function toPrismaDefault(value: string): string {
  if (value === 'CURRENT_TIMESTAMP') return 'now()'
  if (value === 'true') return 'true'
  if (value === 'false') return 'false'
  if (!isNaN(Number(value))) return value
  return `"${value}"`
}
