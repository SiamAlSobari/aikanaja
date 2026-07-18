// Shared API contract types — dipakai semua frontend project + (nanti) backend.
// Sumber kebenaran tunggal (single source of truth) buat tipe lintas project.

export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export interface ErdColumn {
	id: string;
	name: string;
	type: string;
	primaryKey: boolean;
	nullable: boolean;
	unique: boolean;
	defaultValue: string | null;
	foreignKey: { table: string; column: string } | null;
}

export interface ErdTable {
	id: string;
	name: string;
	position: { x: number; y: number };
	columns: ErdColumn[];
}

export interface ErdRelation {
	id: string;
	sourceTableId: string;
	targetTableId: string;
	sourceColumn: string;
	targetColumn: string;
	type: RelationType;
}

export interface ErdSchema {
	tables: ErdTable[];
	relations: ErdRelation[];
}

export interface ErdProject {
	id: string;
	name: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
	schema: ErdSchema | null;
}

export interface GenerateSchemaRequest {
	prompt: string;
	apiKey?: string;
	provider?: string;
}

export interface GenerateSchemaResponse {
	success: boolean;
	schema?: ErdSchema;
	error?: string;
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export type PlanTier = 'free' | 'pro' | 'team';

export interface UsageInfo {
	count: number;
	limit: number;
	remaining: number | 'unlimited';
	isUnlimited: boolean;
}

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar?: string | null;
	bio?: string | null;
	plan?: PlanTier;
	createdAt?: string;
}
