export const COLUMN_TYPES = [
	'UUID',
	'VARCHAR',
	'TEXT',
	'INT',
	'INTEGER',
	'BIGINT',
	'FLOAT',
	'DECIMAL',
	'BOOLEAN',
	'DATE',
	'DATETIME',
	'TIMESTAMP',
	'JSON',
	'JSONB',
	'BLOB'
] as const;

export const RELATION_TYPES = [
	{ value: 'one-to-one', label: 'One-to-One', short: '1:1' },
	{ value: 'one-to-many', label: 'One-to-Many', short: '1:N' },
	{ value: 'many-to-many', label: 'Many-to-Many', short: 'N:M' }
] as const;

export const DB_TARGETS = [
	{ value: 'mysql', label: 'MySQL' },
	{ value: 'postgresql', label: 'PostgreSQL' },
	{ value: 'sqlite', label: 'SQLite' }
] as const;
