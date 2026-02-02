import { resolveSequenceId } from '../../nodes/Reply/utils/GenericFunctions';

jest.mock('../../nodes/Reply/utils/GenericFunctions', () => {
	const actual = jest.requireActual('../../nodes/Reply/utils/GenericFunctions');
	return {
		...actual,
		replyApiRequest: jest.fn(),
	};
});

const createMockExecuteFunctions = (params: Record<string, unknown>) => {
	return {
		getNodeParameter: jest.fn((name: string) => params[name]),
		getNode: jest.fn(() => ({ name: 'Reply', type: 'n8n-nodes-reply.reply' })),
	};
};

describe('resolveSequenceId', () => {
	describe('mode: id', () => {
		it('should return parsed number when given valid numeric string', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'id',
				sequenceId: '123',
			});

			const result = await resolveSequenceId.call(
				mockContext as never,
				'sequenceId',
				0,
			);

			expect(result).toBe(123);
		});

		it('should return number directly when given number', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'id',
				sequenceId: 456,
			});

			const result = await resolveSequenceId.call(
				mockContext as never,
				'sequenceId',
				0,
			);

			expect(result).toBe(456);
		});

		it('should throw NodeApiError when given non-numeric string', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'id',
				sequenceId: 'abc',
			});

			await expect(
				resolveSequenceId.call(mockContext as never, 'sequenceId', 0),
			).rejects.toThrow('Invalid sequence ID: "abc"');
		});

		it('should throw NodeApiError when given empty string', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'id',
				sequenceId: '',
			});

			await expect(
				resolveSequenceId.call(mockContext as never, 'sequenceId', 0),
			).rejects.toThrow('Invalid sequence ID: ""');
		});
	});

	describe('mode: list', () => {
		it('should return parsed number when given valid numeric string', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'list',
				sequenceId: '789',
			});

			const result = await resolveSequenceId.call(
				mockContext as never,
				'sequenceId',
				0,
			);

			expect(result).toBe(789);
		});

		it('should throw NodeApiError when given non-numeric string', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'list',
				sequenceId: 'invalid',
			});

			await expect(
				resolveSequenceId.call(mockContext as never, 'sequenceId', 0),
			).rejects.toThrow('Invalid sequence ID: "invalid"');
		});
	});

	describe('fallback mode', () => {
		it('should throw NodeApiError when given non-numeric string in unknown mode', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'unknown',
				sequenceId: 'not-a-number',
			});

			await expect(
				resolveSequenceId.call(mockContext as never, 'sequenceId', 0),
			).rejects.toThrow('Invalid sequence ID: "not-a-number"');
		});

		it('should return parsed number in unknown mode when given valid numeric string', async () => {
			const mockContext = createMockExecuteFunctions({
				'sequenceId.mode': 'unknown',
				sequenceId: '999',
			});

			const result = await resolveSequenceId.call(
				mockContext as never,
				'sequenceId',
				0,
			);

			expect(result).toBe(999);
		});
	});
});
