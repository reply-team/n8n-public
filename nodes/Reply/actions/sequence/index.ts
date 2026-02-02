import type { INodeProperties } from 'n8n-workflow';

import * as addContact from './addContact.operation';
import * as archive from './archive.operation';
import * as get from './get.operation';
import * as getAll from './getAll.operation';
import * as getContacts from './getContacts.operation';
import * as pause from './pause.operation';
import * as start from './start.operation';

export const operations = {
	addContact,
	archive,
	get,
	getAll,
	getContacts,
	pause,
	start,
};

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sequence'],
			},
		},
		options: [
			{
				name: 'Add Contact',
				value: 'addContact',
				description: 'Add an existing contact to a sequence by contact ID',
				action: 'Add contact to sequence',
			},
			{
				name: 'Archive a Sequence',
				value: 'archive',
				action: 'Archive a sequence',
			},
			{
				name: 'Get a Sequence',
				value: 'get',
				description: 'Get a sequence by ID',
				action: 'Get a sequence',
			},
			{
				name: 'Get Contacts',
				value: 'getContacts',
				description: 'Get contacts in a sequence with pagination',
				action: 'Get contacts in sequence',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sequences with pagination',
				action: 'Get many sequences',
			},
			{
				name: 'Pause a Sequence',
				value: 'pause',
				action: 'Pause a sequence',
			},
			{
				name: 'Start a Sequence',
				value: 'start',
				action: 'Start a sequence',
			},
		],
		default: 'get',
	},
	{
		displayName: 'Sequence',
		name: 'sequenceId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The sequence to manage',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['get', 'start', 'pause', 'archive', 'getContacts', 'addContact'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchSequences',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 12345',
			},
			{
				displayName: 'By Name',
				name: 'name',
				type: 'string',
				placeholder: 'e.g. My Sequence',
			},
		],
	},
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		default: '',
		description: 'First name of the contact. Required when creating a new contact.',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['addContact'],
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
				resource: ['sequence'],
				operation: ['addContact'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		placeholder: 'name@email.com',
		description: 'Email of the contact. Either email or LinkedIn is required.',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['addContact'],
			},
		},
	},
	{
		displayName: 'LinkedIn',
		name: 'linkedIn',
		type: 'string',
		default: '',
		placeholder: 'https://linkedin.com/in/username',
		description: 'LinkedIn profile of the contact. Either email or LinkedIn is required.',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['addContact'],
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
				resource: ['sequence'],
				operation: ['addContact'],
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
				resource: ['sequence'],
				operation: ['addContact'],
			},
		},
	},
	{
		displayName: 'Force Move to Sequence',
		name: 'forcePush',
		type: 'boolean',
		default: false,
		description:
			'Whether to move the contact to the sequence even if already enrolled in one. When off, duplicate contacts are skipped.',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['addContact'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['addContact'],
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
	// Pagination for getContacts and getAll
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
				resource: ['sequence'],
				operation: ['getContacts', 'getAll'],
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
				resource: ['sequence'],
				operation: ['getContacts', 'getAll'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: '',
		description: 'Filter sequences by status',
		displayOptions: {
			show: {
				resource: ['sequence'],
				operation: ['getAll'],
			},
		},
		options: [
			{ name: 'All', value: '' },
			{ name: 'New', value: 'New' },
			{ name: 'Active', value: 'Active' },
			{ name: 'Paused', value: 'Paused' },
		],
	},
];
