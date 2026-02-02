export const EMAIL_EVENTS = {
	EMAIL_REPLIED: 'email_replied',
	EMAIL_SENT: 'email_sent',
	EMAIL_OPENED: 'email_opened',
	EMAIL_LINK_CLICKED: 'email_link_clicked',
	EMAIL_BOUNCED: 'email_bounced',
	REPLY_CATEGORIZED: 'reply_categorized',
} as const;

export const LINKEDIN_EVENTS = {
	LINKEDIN_CONNECTION_REQUEST_SENT: 'linkedin_connection_request_sent',
	LINKEDIN_CONNECTION_REQUEST_ACCEPTED: 'linkedin_connection_request_accepted',
	LINKEDIN_MESSAGE_SENT: 'linkedin_message_sent',
	LINKEDIN_MESSAGE_REPLIED: 'linkedin_message_replied',
	LINKEDIN_REPLY_CATEGORIZED: 'linkedin_reply_categorized',
} as const;

export const SEQUENCE_EVENTS = {
	CONTACT_OPTED_OUT: 'contact_opted_out',
	CONTACT_FINISHED: 'contact_finished',
	CONTACT_CALLED: 'contact_called',
} as const;

export const ACCOUNT_HEALTH_EVENTS = {
	EMAIL_CONNECTION_LOST: 'email_account_connection_lost',
	EMAIL_ERROR: 'email_account_error',
} as const;

export const SELECT_ALL_VALUES = {
	ALL: '*',
	EMAIL: 'email:*',
	LINKEDIN: 'linkedin:*',
	SEQUENCE: 'sequence:*',
	ACCOUNT_HEALTH: 'account_health:*',
} as const;

export const ALL_EMAIL_EVENTS = Object.values(EMAIL_EVENTS);
export const ALL_LINKEDIN_EVENTS = Object.values(LINKEDIN_EVENTS);
export const ALL_SEQUENCE_EVENTS = Object.values(SEQUENCE_EVENTS);
export const ALL_ACCOUNT_HEALTH_EVENTS = Object.values(ACCOUNT_HEALTH_EVENTS);

export const ALL_TRIGGER_EVENTS = [
	...ALL_EMAIL_EVENTS,
	...ALL_LINKEDIN_EVENTS,
	...ALL_SEQUENCE_EVENTS,
	...ALL_ACCOUNT_HEALTH_EVENTS,
] as const;

export const TRIGGER_CATEGORIES = {
	EMAIL: 'email',
	LINKEDIN: 'linkedin',
	SEQUENCE: 'sequence',
	ACCOUNT_HEALTH: 'accountHealth',
} as const;

export type EmailEventType = (typeof EMAIL_EVENTS)[keyof typeof EMAIL_EVENTS];
export type LinkedInEventType = (typeof LINKEDIN_EVENTS)[keyof typeof LINKEDIN_EVENTS];
export type SequenceEventType = (typeof SEQUENCE_EVENTS)[keyof typeof SEQUENCE_EVENTS];
export type AccountHealthEventType =
	(typeof ACCOUNT_HEALTH_EVENTS)[keyof typeof ACCOUNT_HEALTH_EVENTS];
export type TriggerEventType =
	| EmailEventType
	| LinkedInEventType
	| SequenceEventType
	| AccountHealthEventType;
export type TriggerCategoryType = (typeof TRIGGER_CATEGORIES)[keyof typeof TRIGGER_CATEGORIES];
