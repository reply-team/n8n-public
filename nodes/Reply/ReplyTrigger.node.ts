import type {
	IWebhookFunctions,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { replyWebhookApiRequest } from './utils/GenericFunctions';
import {
	ACCOUNT_HEALTH_EVENTS,
	ALL_ACCOUNT_HEALTH_EVENTS,
	ALL_EMAIL_EVENTS,
	ALL_LINKEDIN_EVENTS,
	ALL_SEQUENCE_EVENTS,
	ALL_TRIGGER_EVENTS,
	EMAIL_EVENTS,
	LINKEDIN_EVENTS,
	SELECT_ALL_VALUES,
	SEQUENCE_EVENTS,
} from './utils/constants';

function expandEvents(events: string[]): string[] {
	if (events.includes(SELECT_ALL_VALUES.ALL)) {
		return [...ALL_TRIGGER_EVENTS];
	}

	const expanded: string[] = [];
	for (const event of events) {
		if (event === SELECT_ALL_VALUES.EMAIL) {
			expanded.push(...ALL_EMAIL_EVENTS);
		} else if (event === SELECT_ALL_VALUES.LINKEDIN) {
			expanded.push(...ALL_LINKEDIN_EVENTS);
		} else if (event === SELECT_ALL_VALUES.SEQUENCE) {
			expanded.push(...ALL_SEQUENCE_EVENTS);
		} else if (event === SELECT_ALL_VALUES.ACCOUNT_HEALTH) {
			expanded.push(...ALL_ACCOUNT_HEALTH_EVENTS);
		} else {
			expanded.push(event);
		}
	}
	return [...new Set(expanded)];
}

export class ReplyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Reply Trigger',
		name: 'replyTrigger',
		icon: { light: 'file:../../icons/reply.svg', dark: 'file:../../icons/reply.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["triggerOn"] + ": " + $parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Reply.io events occur',
		defaults: {
			name: 'Reply Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'replyApi',
				required: true,
			},
		],
		usableAsTool: true,
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Trigger On',
				name: 'triggerOn',
				type: 'options',
				default: 'All',
				required: true,
				options: [
					{
						name: 'Account Health Events',
						value: 'AccountHealth',
						description: 'Email account status events',
						action: 'On Account Health events',
					},
					{
						name: 'All Events',
						value: 'All',
						description: 'Trigger on any Reply.io event',
						action: 'On All events',
					},
					{
						name: 'Email Events',
						value: 'Email',
						description: 'Email sending and tracking events',
						action: 'On Email events',
					},
					{
						name: 'LinkedIn Events',
						value: 'LinkedIn',
						description: 'LinkedIn outreach events',
						action: 'On LinkedIn events',
					},
					{
						name: 'Sequence Events',
						value: 'Sequence',
						description: 'Contact lifecycle events',
						action: 'On Sequence events',
					},
				],
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [SELECT_ALL_VALUES.ALL],
				displayOptions: {
					show: {
						triggerOn: ['All'],
					},
				},
				options: [
					{
						name: '*',
						value: SELECT_ALL_VALUES.ALL,
						description: 'All events across all categories',
						action: 'On All events',
					},
				],
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				displayOptions: {
					show: {
						triggerOn: ['Email'],
					},
				},
				options: [
					{
						name: '*',
						value: SELECT_ALL_VALUES.EMAIL,
						description: 'All email events',
						action: 'On All Email events',
					},
					{
						name: 'Email Bounced',
						value: EMAIL_EVENTS.EMAIL_BOUNCED,
						description: 'Email delivery failed',
						action: 'On email bounced',
					},
					{
						name: 'Email Link Clicked',
						value: EMAIL_EVENTS.EMAIL_LINK_CLICKED,
						description: 'Link clicked in email',
						action: 'On email link clicked',
					},
					{
						name: 'Email Opened',
						value: EMAIL_EVENTS.EMAIL_OPENED,
						description: 'Email opened by recipient',
						action: 'On email opened',
					},
					{
						name: 'Email Replied',
						value: EMAIL_EVENTS.EMAIL_REPLIED,
						description: 'First reply received',
						action: 'On email replied',
					},
					{
						name: 'Email Sent',
						value: EMAIL_EVENTS.EMAIL_SENT,
						description: 'Email sent to recipient',
						action: 'On email sent',
					},
					{
						name: 'Reply Categorized',
						value: EMAIL_EVENTS.REPLY_CATEGORIZED,
						description: 'Email reply categorized in inbox',
						action: 'On reply categorized',
					},
				],
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				displayOptions: {
					show: {
						triggerOn: ['LinkedIn'],
					},
				},
				options: [
					{
						name: '*',
						value: SELECT_ALL_VALUES.LINKEDIN,
						description: 'All LinkedIn events',
						action: 'On All LinkedIn events',
					},
					{
						name: 'LinkedIn Connection Accepted',
						value: LINKEDIN_EVENTS.LINKEDIN_CONNECTION_REQUEST_ACCEPTED,
						description: 'Connection request accepted',
						action: 'On LinkedIn connection accepted',
					},
					{
						name: 'LinkedIn Connection Sent',
						value: LINKEDIN_EVENTS.LINKEDIN_CONNECTION_REQUEST_SENT,
						description: 'Connection request sent',
						action: 'On LinkedIn connection sent',
					},
					{
						name: 'LinkedIn Message Replied',
						value: LINKEDIN_EVENTS.LINKEDIN_MESSAGE_REPLIED,
						description: 'First LinkedIn reply received',
						action: 'On LinkedIn message replied',
					},
					{
						name: 'LinkedIn Message Sent',
						value: LINKEDIN_EVENTS.LINKEDIN_MESSAGE_SENT,

						action: 'On LinkedIn message sent',
					},
					{
						name: 'LinkedIn Reply Categorized',
						value: LINKEDIN_EVENTS.LINKEDIN_REPLY_CATEGORIZED,

						action: 'On LinkedIn reply categorized',
					},
				],
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				displayOptions: {
					show: {
						triggerOn: ['Sequence'],
					},
				},
				options: [
					{
						name: '*',
						value: SELECT_ALL_VALUES.SEQUENCE,
						description: 'All sequence events',
						action: 'On All Sequence events',
					},
					{
						name: 'Contact Called',
						value: SEQUENCE_EVENTS.CONTACT_CALLED,
						description: 'Cloud call made or logged',
						action: 'On contact called',
					},
					{
						name: 'Contact Finished',
						value: SEQUENCE_EVENTS.CONTACT_FINISHED,
						description: 'Contact finished sequence',
						action: 'On contact finished',
					},
					{
						name: 'Contact Opted Out',
						value: SEQUENCE_EVENTS.CONTACT_OPTED_OUT,
						description: 'Contact opted out of communication',
						action: 'On contact opted out',
					},
				],
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				displayOptions: {
					show: {
						triggerOn: ['AccountHealth'],
					},
				},
				options: [
					{
						name: '*',
						value: SELECT_ALL_VALUES.ACCOUNT_HEALTH,
						description: 'All account health events',
						action: 'On All Account Health events',
					},
					{
						name: 'Email Account Connection Lost',
						value: ACCOUNT_HEALTH_EVENTS.EMAIL_CONNECTION_LOST,
						description: 'Email account disconnected',
						action: 'On email account connection lost',
					},
					{
						name: 'Email Account Error',
						value: ACCOUNT_HEALTH_EVENTS.EMAIL_ERROR,
						description: 'Email account error occurred',
						action: 'On email account error',
					},
				],
			},
			{
				displayName: "Include Contact's Custom Fields",
				name: 'includeProspectCustomFields',
				type: 'boolean',
				default: false,
				description: "Whether to include the contact's custom fields in the webhook payload",
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const rawEvents = this.getNodeParameter('events', []) as string[];
				const events = expandEvents(rawEvents);

				const registeredEvents = (webhookData.registeredEvents as string[]) || [];
				const registeredWebhookIds = (webhookData.webhookIds as string[]) || [];

				if (registeredWebhookIds.length === 0 || registeredEvents.length === 0) {
					return false;
				}

				const allRegistered = events.every((e) => registeredEvents.includes(e));
				if (!allRegistered || registeredEvents.length !== events.length) {
					return false;
				}

				let existingWebhooks: IDataObject[] = [];
				try {
					const response = await replyWebhookApiRequest.call(this, 'GET', '/v2/webhooks');
					existingWebhooks =
						((response as IDataObject)?.items as IDataObject[]) ||
						(response as IDataObject[]) ||
						[];
				} catch {
					return false;
				}

				const activeWebhooksForEvents = existingWebhooks.filter(
					(wh) => events.includes(String(wh.event)) && wh.url === webhookUrl && !wh.isDisabled,
				);

				const eventsWithActiveWebhook = activeWebhooksForEvents.map((wh) => String(wh.event));
				return events.every((e) => eventsWithActiveWebhook.includes(e));
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const rawEvents = this.getNodeParameter('events', []) as string[];
				const events = expandEvents(rawEvents);
				const includeProspectCustomFields = this.getNodeParameter(
					'includeProspectCustomFields',
					false,
				) as boolean;

				let existingWebhooks: IDataObject[] = [];
				try {
					const response = await replyWebhookApiRequest.call(this, 'GET', '/v2/webhooks');
					existingWebhooks =
						((response as IDataObject)?.items as IDataObject[]) ||
						(response as IDataObject[]) ||
						[];
				} catch {
					existingWebhooks = [];
				}

				const webhookIds: string[] = [];

				for (const event of events) {
					const existingWebhook = existingWebhooks.find(
						(wh) => wh.event === event && wh.url === webhookUrl,
					);

					if (existingWebhook && existingWebhook.id) {
						if (existingWebhook.isDisabled) {
							await replyWebhookApiRequest.call(
								this,
								'PATCH',
								`/v2/webhooks/${existingWebhook.id}`,
								{
									isDisabled: false,
									payload: {
										includeEmailUrl: true,
										includeProspectCustomFields,
									},
								},
							);
						}
						webhookIds.push(String(existingWebhook.id));
					} else {
						const body: IDataObject = {
							event,
							url: webhookUrl,
							isDisabled: false,
							payload: {
								includeEmailUrl: true,
								includeProspectCustomFields,
							},
						};

						const response = await replyWebhookApiRequest.call(this, 'POST', '/v2/webhooks', body);
						const webhookId = (response as IDataObject)?.id;
						if (webhookId) {
							webhookIds.push(String(webhookId));
						}
					}
				}

				webhookData.webhookIds = webhookIds;
				webhookData.registeredEvents = [...events];

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookIds = (webhookData.webhookIds as string[]) || [];

				for (const id of webhookIds) {
					await replyWebhookApiRequest.call(this, 'DELETE', `/v2/webhooks/${id}`);
				}

				delete webhookData.webhookIds;
				delete webhookData.registeredEvents;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		return {
			workflowData: [[{ json: bodyData }]],
		};
	}
}
