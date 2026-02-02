import {
	validateContact,
	validateEnrollment,
	validateEnrollmentByContact,
} from '../../nodes/Reply/utils/validation';

describe('validateContact', () => {
	it('should pass with valid email only', () => {
		const result = validateContact({ email: 'test@example.com' });
		expect(result.email).toBe('test@example.com');
	});

	it('should pass with all optional fields', () => {
		const data = {
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe',
			company: 'Acme Inc',
			city: 'New York',
			state: 'NY',
			country: 'USA',
			title: 'Engineer',
			phone: '+1234567890',
			linkedInProfile: 'https://linkedin.com/in/johndoe',
		};
		const result = validateContact(data);
		expect(result.email).toBe('test@example.com');
		expect(result.firstName).toBe('John');
		expect(result.lastName).toBe('Doe');
	});

	it('should fail when email is missing', () => {
		expect(() => validateContact({})).toThrow('Validation failed');
	});

	it('should fail when email is invalid', () => {
		expect(() => validateContact({ email: 'not-an-email' })).toThrow('Validation failed');
	});

	it('should fail when unknown fields are present', () => {
		expect(() =>
			validateContact({
				email: 'test@example.com',
				unknownField: 'value',
			}),
		).toThrow("unknown field 'unknownField' not allowed");
	});

	it('should aggregate multiple errors', () => {
		expect(() =>
			validateContact({
				email: 'invalid',
				unknownField: 'value',
			}),
		).toThrow('Validation failed');
	});
});

describe('validateEnrollment', () => {
	it('should pass with contactId', () => {
		const result = validateEnrollment({ contactId: 123 });
		expect(result.contactId).toBe(123);
	});

	it('should pass with contact object', () => {
		const result = validateEnrollment({
			contact: { email: 'test@example.com' },
		});
		expect(result.contact?.email).toBe('test@example.com');
	});

	it('should fail when startStepId is provided', () => {
		expect(() =>
			validateEnrollment({
				contactId: 123,
				startStepId: 456,
			}),
		).toThrow('startStepId is not supported');
	});

	it('should fail when neither contactId nor contact is provided', () => {
		expect(() => validateEnrollment({})).toThrow('Provide either contactId or contact');
	});

	it('should fail when both contactId and contact are provided', () => {
		expect(() =>
			validateEnrollment({
				contactId: 123,
				contact: { email: 'test@example.com' },
			}),
		).toThrow('Provide either contactId or contact, not both');
	});
});

describe('validateEnrollmentByContact', () => {
	it('should pass with valid contact object', () => {
		const result = validateEnrollmentByContact({
			contact: { email: 'test@example.com' },
		});
		expect(result.contact.email).toBe('test@example.com');
	});

	it('should pass with contact object and all optional fields', () => {
		const result = validateEnrollmentByContact({
			contact: {
				email: 'test@example.com',
				firstName: 'John',
				lastName: 'Doe',
				company: 'Acme',
			},
		});
		expect(result.contact.email).toBe('test@example.com');
		expect(result.contact.firstName).toBe('John');
	});

	it('should pass with forcePush option', () => {
		const result = validateEnrollmentByContact({
			contact: { email: 'test@example.com' },
			forcePush: true,
		});
		expect(result.forcePush).toBe(true);
	});

	it('should fail when contact is missing', () => {
		expect(() => validateEnrollmentByContact({})).toThrow('contact is required');
	});

	it('should fail when contact email is missing', () => {
		expect(() => validateEnrollmentByContact({ contact: {} })).toThrow('Validation failed');
	});

	it('should fail when contact email is invalid', () => {
		expect(() => validateEnrollmentByContact({ contact: { email: 'invalid' } })).toThrow(
			'Validation failed',
		);
	});

	it('should fail when contactId is provided', () => {
		expect(() =>
			validateEnrollmentByContact({
				contact: { email: 'test@example.com' },
				contactId: 123,
			}),
		).toThrow('contactId is not allowed');
	});

	it('should fail when startStepId is provided', () => {
		expect(() =>
			validateEnrollmentByContact({
				contact: { email: 'test@example.com' },
				startStepId: 456,
			}),
		).toThrow('startStepId is not supported');
	});

	it('should fail when unknown fields are present', () => {
		expect(() =>
			validateEnrollmentByContact({
				contact: { email: 'test@example.com' },
				unknownField: 'value',
			}),
		).toThrow("unknown field 'unknownField' not allowed");
	});
});
