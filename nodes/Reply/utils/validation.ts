export interface Contact {
	id?: number;
	email: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	title?: string;
	company?: string;
	domain?: string;
	city?: string;
	state?: string;
	country?: string;
	timeZone?: string;
	phone?: string;
	phoneStatus?: string;
	linkedInProfile?: string;
	linkedInSalesNavigator?: string;
	linkedInRecruiter?: string;
	companySize?: string;
	industry?: string;
	notes?: string;
}

export interface Enrollment {
	contactId?: number;
	contact?: Contact;
	forcePush: boolean;
}

export interface EnrollmentById {
	contactId: number;
	forcePush: boolean;
}

export interface EnrollmentByContact {
	contact: Contact;
	forcePush: boolean;
}

const CONTACT_ALLOWED_FIELDS = new Set([
	'id',
	'email',
	'firstName',
	'lastName',
	'fullName',
	'title',
	'company',
	'domain',
	'city',
	'state',
	'country',
	'timeZone',
	'phone',
	'phoneStatus',
	'linkedInProfile',
	'linkedInSalesNavigator',
	'linkedInRecruiter',
	'companySize',
	'industry',
	'notes',
]);

const ENROLLMENT_BY_CONTACT_ALLOWED_FIELDS = new Set(['contact', 'forcePush']);

function isValidEmail(email: unknown): email is string {
	if (typeof email !== 'string') return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function findUnknownFields(data: Record<string, unknown>, allowedFields: Set<string>): string[] {
	return Object.keys(data).filter((key) => !allowedFields.has(key));
}

function formatValidationErrors(errors: string[]): string {
	return `Validation failed: ${errors.join('; ')}`;
}

export function validateContact(data: unknown): Contact {
	const errors: string[] = [];

	if (typeof data !== 'object' || data === null) {
		throw new Error('Validation failed: email: Required');
	}

	const obj = data as Record<string, unknown>;

	const unknownFields = findUnknownFields(obj, CONTACT_ALLOWED_FIELDS);
	if (unknownFields.length > 0) {
		errors.push(`unknown field '${unknownFields.join(', ')}' not allowed`);
	}

	if (!('email' in obj) || obj.email === undefined || obj.email === '') {
		errors.push('email: Required');
	} else if (!isValidEmail(obj.email)) {
		errors.push('email: Invalid email');
	}

	if (errors.length > 0) {
		throw new Error(formatValidationErrors(errors));
	}

	return {
		email: obj.email as string,
		...(obj.id !== undefined && { id: obj.id as number }),
		...(obj.firstName !== undefined && { firstName: obj.firstName as string }),
		...(obj.lastName !== undefined && { lastName: obj.lastName as string }),
		...(obj.fullName !== undefined && { fullName: obj.fullName as string }),
		...(obj.title !== undefined && { title: obj.title as string }),
		...(obj.company !== undefined && { company: obj.company as string }),
		...(obj.domain !== undefined && { domain: obj.domain as string }),
		...(obj.city !== undefined && { city: obj.city as string }),
		...(obj.state !== undefined && { state: obj.state as string }),
		...(obj.country !== undefined && { country: obj.country as string }),
		...(obj.timeZone !== undefined && { timeZone: obj.timeZone as string }),
		...(obj.phone !== undefined && { phone: obj.phone as string }),
		...(obj.phoneStatus !== undefined && { phoneStatus: obj.phoneStatus as string }),
		...(obj.linkedInProfile !== undefined && { linkedInProfile: obj.linkedInProfile as string }),
		...(obj.linkedInSalesNavigator !== undefined && {
			linkedInSalesNavigator: obj.linkedInSalesNavigator as string,
		}),
		...(obj.linkedInRecruiter !== undefined && {
			linkedInRecruiter: obj.linkedInRecruiter as string,
		}),
		...(obj.companySize !== undefined && { companySize: obj.companySize as string }),
		...(obj.industry !== undefined && { industry: obj.industry as string }),
		...(obj.notes !== undefined && { notes: obj.notes as string }),
	};
}

export function validateEnrollment(data: unknown): Enrollment {
	if (typeof data !== 'object' || data === null) {
		throw new Error('Validation failed: Provide either contactId or contact');
	}

	const obj = data as Record<string, unknown>;

	if ('startStepId' in obj) {
		throw new Error('Validation failed: startStepId is not supported in this version');
	}

	const hasContactId = 'contactId' in obj && obj.contactId !== undefined;
	const hasContact = 'contact' in obj && obj.contact !== undefined;

	if (!hasContactId && !hasContact) {
		throw new Error('Validation failed: Provide either contactId or contact');
	}

	if (hasContactId && hasContact) {
		throw new Error('Validation failed: Provide either contactId or contact, not both');
	}

	const forcePush = typeof obj.forcePush === 'boolean' ? obj.forcePush : false;

	if (hasContactId) {
		return {
			contactId: obj.contactId as number,
			forcePush,
		};
	}

	const validatedContact = validateContact(obj.contact);
	return {
		contact: validatedContact,
		forcePush,
	};
}

export function validateEmail(email: unknown): string {
	if (email === undefined || email === null || email === '') {
		throw new Error('Validation failed: email is required');
	}

	if (!isValidEmail(email)) {
		throw new Error('Validation failed: Invalid email');
	}

	return email;
}

export function validateContactId(id: unknown): number {
	if (id === undefined || id === null) {
		throw new Error('Validation failed: contactId is required');
	}

	if (typeof id !== 'number') {
		throw new Error('Validation failed: contactId must be a number');
	}

	if (id <= 0) {
		throw new Error('Validation failed: contactId must be a positive number');
	}

	return id;
}

export function validateSequenceId(id: unknown): number {
	if (id === undefined || id === null) {
		throw new Error('Validation failed: sequenceId is required');
	}

	if (typeof id !== 'number') {
		throw new Error('Validation failed: sequenceId must be a number');
	}

	if (id <= 0) {
		throw new Error('Validation failed: sequenceId must be a positive number');
	}

	return id;
}

export function validateEnrollmentByContact(data: unknown): EnrollmentByContact {
	if (typeof data !== 'object' || data === null) {
		throw new Error('Validation failed: contact is required');
	}

	const obj = data as Record<string, unknown>;

	if ('startStepId' in obj) {
		throw new Error('Validation failed: startStepId is not supported in this version');
	}

	if ('contactId' in obj) {
		throw new Error('Validation failed: contactId is not allowed in add-by-contact mode');
	}

	if (!('contact' in obj) || obj.contact === undefined) {
		throw new Error('Validation failed: contact is required');
	}

	const unknownFields = findUnknownFields(obj, ENROLLMENT_BY_CONTACT_ALLOWED_FIELDS);
	if (unknownFields.length > 0) {
		throw new Error(
			formatValidationErrors([`unknown field '${unknownFields.join(', ')}' not allowed`]),
		);
	}

	const validatedContact = validateContact(obj.contact);

	const forcePush = typeof obj.forcePush === 'boolean' ? obj.forcePush : false;

	return {
		contact: validatedContact,
		forcePush,
	};
}
