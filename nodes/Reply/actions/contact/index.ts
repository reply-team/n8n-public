import type { INodeProperties } from 'n8n-workflow';

import * as create from './create.operation';
import * as update from './update.operation';
import * as del from './delete.operation';
import * as get from './get.operation';
import * as getAll from './getAll.operation';

export const operations = {
	create,
	update,
	delete: del,
	get,
	getAll,
};

const CONTACT_LOCATOR_MODES = [
	{
		displayName: 'By ID',
		name: 'id',
		type: 'string' as const,
		placeholder: 'e.g. 12345',
	},
	{
		displayName: 'By Email',
		name: 'email',
		type: 'string' as const,
		placeholder: 'e.g. name@email.com',
	},
	{
		displayName: 'By LinkedIn',
		name: 'linkedIn',
		type: 'string' as const,
		placeholder: 'e.g. https://linkedin.com/in/username',
	},
];

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create a contact',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a contact',
				action: 'Delete a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact',
				action: 'Get a contact',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many contacts with pagination',
				action: 'Get many contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing contact',
				action: 'Update a contact',
			},
		],
		default: 'create',
	},
	// Delete/Get/Update - Contact locator
	{
		displayName: 'Contact',
		name: 'contactLocator',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		description: 'The contact to operate on',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['delete', 'get', 'update'],
			},
		},
		modes: CONTACT_LOCATOR_MODES,
	},
	// Create - First Name (required)
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		description: 'First name of the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
	},
	// Update - First Name (optional)
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		description: 'First name of the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		default: '',
		description: 'Last name of the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'Email address of the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'updateEmail',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		description: 'New email address for the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'LinkedIn Profile',
		name: 'linkedInProfile',
		type: 'string',
		placeholder: 'https://linkedin.com/in/username',
		default: '',
		description: 'LinkedIn profile URL of the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'LinkedIn Profile',
		name: 'updateLinkedInProfile',
		type: 'string',
		placeholder: 'https://linkedin.com/in/username',
		default: '',
		description: 'New LinkedIn profile URL for the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		description: 'Phone number of the contact',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Company',
		name: 'company',
		type: 'string',
		default: '',
		description: 'Company name',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
	},
	// Get Many operation
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of items to skip',
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
	},
	// Additional fields for Create and Update (shared)
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City of the contact',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country of the contact',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State or region of the contact',
			},
			{
				displayName: 'Time Zone',
				name: 'timeZone',
				type: 'string',
				default: '',
				description: 'Time zone identifier for the contact',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Job title of the contact',
			},
		],
	},
];
