import type { INodePropertyOptions, INodeProperties } from 'n8n-workflow';
import { ReplyTrigger } from '../../nodes/Reply/ReplyTrigger.node';
import {
	ACCOUNT_HEALTH_EVENTS,
	EMAIL_EVENTS,
	LINKEDIN_EVENTS,
	SEQUENCE_EVENTS,
} from '../../nodes/Reply/utils/constants';

describe('ReplyTrigger', () => {
	let trigger: ReplyTrigger;

	beforeEach(() => {
		trigger = new ReplyTrigger();
	});

	describe('description', () => {
		it('should have correct display name', () => {
			expect(trigger.description.displayName).toBe('Reply Trigger');
		});

		it('should have correct node name', () => {
			expect(trigger.description.name).toBe('replyTrigger');
		});

		it('should be version 1', () => {
			expect(trigger.description.version).toBe(1);
		});

		it('should require replyApi credentials', () => {
			const creds = trigger.description.credentials;
			expect(creds).toBeDefined();
			expect(creds).toContainEqual({ name: 'replyApi', required: true });
		});

		it('should have webhook definition', () => {
			expect(trigger.description.webhooks).toBeDefined();
			expect(trigger.description.webhooks).toHaveLength(1);
			expect(trigger.description.webhooks![0]).toMatchObject({
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			});
		});
	});

	describe('triggerOn categories', () => {
		it('should have triggerOn property with category options', () => {
			const triggerOnProp = trigger.description.properties.find((p) => p.name === 'triggerOn');
			expect(triggerOnProp).toBeDefined();
			expect(triggerOnProp?.type).toBe('options');

			const options = (triggerOnProp?.options ?? []) as INodePropertyOptions[];
			const values = options.map((o) => o.value);

			expect(values).toContain('All');
			expect(values).toContain('Email');
			expect(values).toContain('LinkedIn');
			expect(values).toContain('Sequence');
			expect(values).toContain('AccountHealth');
		});
	});

	describe('email events', () => {
		it('should have events property for email category', () => {
			const emailEventsProps = trigger.description.properties.filter(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('Email'),
			);
			expect(emailEventsProps).toHaveLength(1);
		});

		it('should include all email events per Reply spec', () => {
			const emailEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('Email'),
			) as INodeProperties;

			const options = (emailEventsProp?.options ?? []) as INodePropertyOptions[];
			const eventValues = options.map((o) => o.value);

			expect(eventValues).toContain(EMAIL_EVENTS.EMAIL_REPLIED);
			expect(eventValues).toContain(EMAIL_EVENTS.EMAIL_SENT);
			expect(eventValues).toContain(EMAIL_EVENTS.EMAIL_OPENED);
			expect(eventValues).toContain(EMAIL_EVENTS.EMAIL_LINK_CLICKED);
			expect(eventValues).toContain(EMAIL_EVENTS.EMAIL_BOUNCED);
			expect(eventValues).toContain(EMAIL_EVENTS.REPLY_CATEGORIZED);
		});

		it('should have 7 email event options (including select all)', () => {
			const emailEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('Email'),
			) as INodeProperties;

			const options = (emailEventsProp?.options ?? []) as INodePropertyOptions[];
			expect(options).toHaveLength(7);
		});
	});

	describe('linkedin events', () => {
		it('should have events property for linkedin category', () => {
			const linkedinEventsProps = trigger.description.properties.filter(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('LinkedIn'),
			);
			expect(linkedinEventsProps).toHaveLength(1);
		});

		it('should include all LinkedIn events per Reply spec', () => {
			const linkedinEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('LinkedIn'),
			) as INodeProperties;

			const options = (linkedinEventsProp?.options ?? []) as INodePropertyOptions[];
			const eventValues = options.map((o) => o.value);

			expect(eventValues).toContain(LINKEDIN_EVENTS.LINKEDIN_CONNECTION_REQUEST_SENT);
			expect(eventValues).toContain(LINKEDIN_EVENTS.LINKEDIN_CONNECTION_REQUEST_ACCEPTED);
			expect(eventValues).toContain(LINKEDIN_EVENTS.LINKEDIN_MESSAGE_SENT);
			expect(eventValues).toContain(LINKEDIN_EVENTS.LINKEDIN_MESSAGE_REPLIED);
			expect(eventValues).toContain(LINKEDIN_EVENTS.LINKEDIN_REPLY_CATEGORIZED);
		});

		it('should have 6 linkedin event options (including select all)', () => {
			const linkedinEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('LinkedIn'),
			) as INodeProperties;

			const options = (linkedinEventsProp?.options ?? []) as INodePropertyOptions[];
			expect(options).toHaveLength(6);
		});
	});

	describe('sequence events', () => {
		it('should have events property for sequence category', () => {
			const sequenceEventsProps = trigger.description.properties.filter(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('Sequence'),
			);
			expect(sequenceEventsProps).toHaveLength(1);
		});

		it('should include all sequence/contact events per Reply spec', () => {
			const sequenceEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('Sequence'),
			) as INodeProperties;

			const options = (sequenceEventsProp?.options ?? []) as INodePropertyOptions[];
			const eventValues = options.map((o) => o.value);

			expect(eventValues).toContain(SEQUENCE_EVENTS.CONTACT_OPTED_OUT);
			expect(eventValues).toContain(SEQUENCE_EVENTS.CONTACT_FINISHED);
			expect(eventValues).toContain(SEQUENCE_EVENTS.CONTACT_CALLED);
		});

		it('should have 4 sequence event options (including select all)', () => {
			const sequenceEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('Sequence'),
			) as INodeProperties;

			const options = (sequenceEventsProp?.options ?? []) as INodePropertyOptions[];
			expect(options).toHaveLength(4);
		});
	});

	describe('account health events', () => {
		it('should have events property for accountHealth category', () => {
			const accountHealthEventsProps = trigger.description.properties.filter(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('AccountHealth'),
			);
			expect(accountHealthEventsProps).toHaveLength(1);
		});

		it('should include all account health events per Reply spec', () => {
			const accountHealthEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('AccountHealth'),
			) as INodeProperties;

			const options = (accountHealthEventsProp?.options ?? []) as INodePropertyOptions[];
			const eventValues = options.map((o) => o.value);

			expect(eventValues).toContain(ACCOUNT_HEALTH_EVENTS.EMAIL_CONNECTION_LOST);
			expect(eventValues).toContain(ACCOUNT_HEALTH_EVENTS.EMAIL_ERROR);
		});

		it('should have 3 account health event options (including select all)', () => {
			const accountHealthEventsProp = trigger.description.properties.find(
				(p) =>
					p.name === 'events' &&
					(p.displayOptions?.show?.triggerOn as string[])?.includes('AccountHealth'),
			) as INodeProperties;

			const options = (accountHealthEventsProp?.options ?? []) as INodePropertyOptions[];
			expect(options).toHaveLength(3);
		});
	});

	describe('includeProspectCustomFields', () => {
		it('should have includeProspectCustomFields as top-level boolean property with default false', () => {
			const includeProspectCustomFields = trigger.description.properties.find(
				(p) => p.name === 'includeProspectCustomFields',
			);

			expect(includeProspectCustomFields).toBeDefined();
			expect(includeProspectCustomFields?.type).toBe('boolean');
			expect(includeProspectCustomFields?.default).toBe(false);
		});
	});

	describe('webhookMethods', () => {
		it('should have webhookMethods defined', () => {
			expect(trigger.webhookMethods).toBeDefined();
		});

		it('should have default webhook methods', () => {
			expect(trigger.webhookMethods?.default).toBeDefined();
		});

		it('should have checkExists method', () => {
			expect(trigger.webhookMethods?.default?.checkExists).toBeDefined();
			expect(typeof trigger.webhookMethods?.default?.checkExists).toBe('function');
		});

		it('should have create method', () => {
			expect(trigger.webhookMethods?.default?.create).toBeDefined();
			expect(typeof trigger.webhookMethods?.default?.create).toBe('function');
		});

		it('should have delete method', () => {
			expect(trigger.webhookMethods?.default?.delete).toBeDefined();
			expect(typeof trigger.webhookMethods?.default?.delete).toBe('function');
		});
	});
});
