import { mapPagination } from '../../nodes/Reply/utils/mappings';

describe('mapPagination', () => {
	it('should map limit to top and offset to skip', () => {
		const result = mapPagination({ limit: 100, offset: 50 });
		expect(result).toEqual({ top: 100, skip: 50 });
	});

	it('should use default values when not provided', () => {
		const result = mapPagination({});
		expect(result).toEqual({ top: 50, skip: 0 });
	});

	it('should cap limit at max page size of 100', () => {
		const result = mapPagination({ limit: 2000 });
		expect(result.top).toBe(100);
	});

	it('should ensure minimum limit of 1', () => {
		const result = mapPagination({ limit: 0 });
		expect(result.top).toBe(1);
	});

	it('should ensure minimum offset of 0', () => {
		const result = mapPagination({ offset: -10 });
		expect(result.skip).toBe(0);
	});

	it('should handle partial params', () => {
		const result = mapPagination({ limit: 25 });
		expect(result).toEqual({ top: 25, skip: 0 });
	});
});
