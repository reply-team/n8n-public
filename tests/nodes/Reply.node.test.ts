import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { Reply } from '../../nodes/Reply/Reply.node';

describe('Reply', () => {
	let node: Reply;

	beforeEach(() => {
		node = new Reply();
	});

	describe('description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('Reply');
		});

		it('should have correct node name', () => {
			expect(node.description.name).toBe('reply');
		});

		it('should be version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should require replyApi credentials', () => {
			const creds = node.description.credentials;
			expect(creds).toBeDefined();
			expect(creds).toContainEqual({ name: 'replyApi', required: true });
		});
	});

	describe('resources', () => {
		it('should have contact resource', () => {
			const resourceProp = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProp).toBeDefined();
			const options = (resourceProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('contact');
		});

		it('should have contactStatus resource', () => {
			const resourceProp = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProp).toBeDefined();
			const options = (resourceProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('contactStatus');
		});

		it('should have sequence resource', () => {
			const resourceProp = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProp).toBeDefined();
			const options = (resourceProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('sequence');
		});
	});

	describe('contact operations', () => {
		it('should have create operation for contacts', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			expect(operationProp).toBeDefined();
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('create');
		});

		it('should have update operation for contacts', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			expect(operationProp).toBeDefined();
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('update');
		});

		it('should have firstName for create operation (required)', () => {
			const firstNameProp = node.description.properties.find(
				(p) =>
					p.name === 'firstName' &&
					p.displayOptions?.show?.operation?.includes('create'),
			);
			expect(firstNameProp).toBeDefined();
			expect(firstNameProp?.required).toBe(true);
		});

		it('should have firstName for update operation (optional)', () => {
			const firstNameProp = node.description.properties.find(
				(p) =>
					p.name === 'firstName' &&
					p.displayOptions?.show?.operation?.includes('update'),
			);
			expect(firstNameProp).toBeDefined();
			expect(firstNameProp?.required).toBeFalsy();
		});

		it('should have contactLocator for update operation', () => {
			const contactLocatorProp = node.description.properties.find(
				(p) =>
					p.name === 'contactLocator' &&
					p.displayOptions?.show?.operation?.includes('update'),
			);
			expect(contactLocatorProp).toBeDefined();
			expect(contactLocatorProp?.type).toBe('resourceLocator');
		});

		it('should have additionalFields for create and update operations', () => {
			const additionalFieldsProp = node.description.properties.find(
				(p) =>
					p.name === 'additionalFields' &&
					p.displayOptions?.show?.operation?.includes('create') &&
					p.displayOptions?.show?.operation?.includes('update'),
			);
			expect(additionalFieldsProp).toBeDefined();
			expect(additionalFieldsProp?.type).toBe('collection');
		});

		// Get Contact tests (unified operation with resourceLocator)
		it('should have get operation for contacts', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			expect(operationProp).toBeDefined();
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('get');
		});

		it('should have get operation with correct metadata', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const getOption = options.find((o) => o.value === 'get');
			expect(getOption).toBeDefined();
			expect(getOption?.name).toBe('Get');
		});

		it('should have contactLocator resourceLocator for get operation', () => {
			const contactLocatorProp = node.description.properties.find(
				(p) =>
					p.name === 'contactLocator' &&
					p.displayOptions?.show?.resource?.includes('contact') &&
					p.displayOptions?.show?.operation?.includes('get'),
			);
			expect(contactLocatorProp).toBeDefined();
			expect(contactLocatorProp?.required).toBe(true);
			expect(contactLocatorProp?.type).toBe('resourceLocator');
		});

		// Delete Contact tests
		it('should have delete operation for contacts', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			expect(operationProp).toBeDefined();
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('delete');
		});

		it('should have delete operation with correct metadata', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const deleteOption = options.find((o) => o.value === 'delete');
			expect(deleteOption).toBeDefined();
			expect(deleteOption?.name).toBe('Delete');
		});

		it('should have contactLocator for delete operation', () => {
			const contactLocatorProp = node.description.properties.find(
				(p) =>
					p.name === 'contactLocator' &&
					p.displayOptions?.show?.operation?.includes('delete'),
			);
			expect(contactLocatorProp).toBeDefined();
			expect(contactLocatorProp?.required).toBe(true);
			expect(contactLocatorProp?.type).toBe('resourceLocator');
		});

		// Get Many tests
		it('should have getAll operation for contacts', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			expect(operationProp).toBeDefined();
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('getAll');
		});

		it('should only have 5 contact operations (no status ops)', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contact'),
			);
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			expect(options.length).toBe(5);
			const values = options.map((o) => o.value);
			expect(values).toEqual(['create', 'delete', 'get', 'getAll', 'update']);
		});
	});

	describe('contactStatus operations', () => {
		it('should have updateStatus and clearStatus operations', () => {
			const operationProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes('contactStatus'),
			);
			expect(operationProp).toBeDefined();
			const options = (operationProp?.options ?? []) as INodePropertyOptions[];
			expect(options.length).toBe(2);

			const values = options.map((o) => o.value);
			expect(values).toContain('updateStatus');
			expect(values).toContain('clearStatus');
		});

		it('should have shared contactLocator with id, email, and linkedIn modes', () => {
			const contactLocatorProp = node.description.properties.find(
				(p) =>
					p.name === 'contactLocator' &&
					p.displayOptions?.show?.resource?.includes('contactStatus'),
			) as INodeProperties;
			expect(contactLocatorProp).toBeDefined();
			expect(contactLocatorProp?.type).toBe('resourceLocator');
			expect(contactLocatorProp?.required).toBe(true);

			const modes = contactLocatorProp?.modes ?? [];
			const modeNames = modes.map((m: { name: string }) => m.name);
			expect(modeNames).toContain('id');
			expect(modeNames).toContain('email');
			expect(modeNames).toContain('linkedIn');
		});

		it('should have statuses multiOptions with 10 options', () => {
			const statusesProp = node.description.properties.find(
				(p) =>
					p.name === 'statuses' &&
					p.displayOptions?.show?.resource?.includes('contactStatus'),
			) as INodeProperties;
			expect(statusesProp).toBeDefined();
			expect(statusesProp?.type).toBe('multiOptions');

			const options = (statusesProp?.options ?? []) as INodePropertyOptions[];
			expect(options.length).toBe(10);
		});

		it('should have additionalFields with sequenceId resourceLocator', () => {
			const additionalFieldsProp = node.description.properties.find(
				(p) =>
					p.name === 'additionalFields' &&
					p.displayOptions?.show?.resource?.includes('contactStatus'),
			) as INodeProperties;
			expect(additionalFieldsProp).toBeDefined();
			expect(additionalFieldsProp?.type).toBe('collection');

			const options = (additionalFieldsProp?.options ?? []) as INodeProperties[];
			const sequenceIdOption = options.find((o) => o.name === 'sequenceId');
			expect(sequenceIdOption).toBeDefined();
			expect(sequenceIdOption?.type).toBe('resourceLocator');
		});
	});
});
