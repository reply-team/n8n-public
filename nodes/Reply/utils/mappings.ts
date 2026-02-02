import type { IDataObject } from 'n8n-workflow';

const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
	limit?: number;
	offset?: number;
}

export interface ReplyPaginationParams {
	top: number;
	skip: number;
}

export function mapPagination(params: PaginationParams): ReplyPaginationParams {
	const limit = params.limit ?? 50;
	const offset = params.offset ?? 0;

	return {
		top: Math.min(Math.max(1, limit), MAX_PAGE_SIZE),
		skip: Math.max(0, offset),
	};
}

export function mapContactFields(uiFields: IDataObject): IDataObject {
	return { ...uiFields };
}
