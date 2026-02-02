import type { INodeProperties } from 'n8n-workflow';

import * as clearStatus from './clearStatus.operation';
import * as updateStatus from './updateStatus.operation';

export const operations = {
	clearStatus,
	updateStatus,
};

const STATUS_OPTIONS = [
	{
		name: 'Active',
		value: 'Active',
		description: 'Restore a contact to active status',
	},
	{
		name: 'Bounced',
		value: 'Bounced',
		description: 'Mark contact as bounced',
	},
	{
		name: 'Called',
		value: 'Called',
		description: 'Mark contact as called',
	},
	{
		name: 'Finished',
		value: 'Finished',
		description: 'Mark contact as finished in sequence',
	},
	{
		name: 'Meeting Booked',
		value: 'MeetingBooked',
		description: 'Mark contact as meeting booked',
	},
	{
		name: 'Opted Out',
		value: 'OptedOut',
		description: 'Opt out contact globally',
	},
	{
		name: 'Out Of Office',
		value: 'OutOfOffice',
		description: 'Mark contact as out of office',
	},
	{
		name: 'Paused',
		value: 'Paused',
		description: 'Pause contact in sequence',
	},
	{
		name: 'Replied',
		value: 'Replied',
		description: 'Mark contact as replied',
	},
	{
		name: 'To Call',
		value: 'ToCall',
		description: 'Mark contact as to-call',
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
				resource: ['contactStatus'],
			},
		},
		options: [
			{
				name: 'Clear Status',
				value: 'clearStatus',
				description: 'Clear statuses from a contact',
				action: 'Clear contact status',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				description: 'Update the status of a contact',
				action: 'Update contact status',
			},
		],
		default: 'updateStatus',
	},
	{
		displayName: 'Contact',
		name: 'contactLocator',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		description: 'The contact to update',
		displayOptions: {
			show: {
				resource: ['contactStatus'],
			},
		},
		modes: [
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 12345',
			},
			{
				displayName: 'By Email',
				name: 'email',
				type: 'string',
				placeholder: 'e.g. name@email.com',
			},
			{
				displayName: 'By LinkedIn',
				name: 'linkedIn',
				type: 'string',
				placeholder: 'e.g. https://linkedin.com/in/username',
			},
		],
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		default: 'Active',
		description: 'The status to set on the contact',
		displayOptions: {
			show: {
				resource: ['contactStatus'],
				operation: ['updateStatus'],
			},
		},
		options: STATUS_OPTIONS,
	},
	{
		displayName: 'Statuses',
		name: 'statuses',
		type: 'multiOptions',
		default: [],
		description: 'The statuses to clear. Leave empty to clear all statuses.',
		displayOptions: {
			show: {
				resource: ['contactStatus'],
				operation: ['clearStatus'],
			},
		},
		options: STATUS_OPTIONS,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contactStatus'],
			},
		},
		options: [
			{
				displayName: 'Sequence',
				name: 'sequenceId',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'The sequence where the status change applies. If not provided, applies globally.',
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
		],
	},
];
