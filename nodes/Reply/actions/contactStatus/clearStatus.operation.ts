import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { replyApiRequest, resolveContactId, resolveSequenceId } from '../../utils/GenericFunctions';

const ALL_CLEARABLE: string[] = [
	'Paused',
	'OutOfOffice',
	'Finished',
	'Replied',
	'Bounced',
	'OptedOut',
	'Called',
	'ToCall',
	'MeetingBooked',
];

// Clearing a sequence-scoped status means flipping to a different sequence status.
// Paused/OutOfOffice/Finished → resume (active); Active → pause (legacy n8n semantic).
const SEQUENCE_CLEAR_TARGET: Record<string, string> = {
	Paused: 'active',
	OutOfOffice: 'active',
	Finished: 'active',
	Active: 'paused',
};

async function clearOne(
	ctx: IExecuteFunctions,
	contactId: number,
	status: string,
	sequenceId: number | undefined,
): Promise<{ status: string; response: unknown }> {
	if (status in SEQUENCE_CLEAR_TARGET) {
		const body: IDataObject = {
			contactIds: [contactId],
			statusInSequence: SEQUENCE_CLEAR_TARGET[status],
		};
		const path = sequenceId
			? `/v3/sequences/${sequenceId}/contacts/set-status-in-sequence`
			: '/v3/contacts/set-status-in-sequence';
		return { status, response: await replyApiRequest.call(ctx, 'POST', path, body) };
	}

	if (status === 'Replied') {
		const body: IDataObject = { contactIds: [contactId], isReplied: false };
		const path = sequenceId
			? `/v3/sequences/${sequenceId}/contacts/set-replied`
			: '/v3/contacts/set-replied';
		return { status, response: await replyApiRequest.call(ctx, 'POST', path, body) };
	}

	if (status === 'Bounced') {
		const body: IDataObject = {
			contactIds: [contactId],
			isBounced: false,
			resendEmails: false,
		};
		const path = sequenceId
			? `/v3/sequences/${sequenceId}/contacts/set-bounced`
			: '/v3/contacts/set-bounced';
		return { status, response: await replyApiRequest.call(ctx, 'POST', path, body) };
	}

	if (status === 'OptedOut') {
		return {
			status,
			response: await replyApiRequest.call(ctx, 'PATCH', `/v3/contacts/${contactId}`, {
				isOptedOut: false,
			}),
		};
	}

	if (status === 'Called' || status === 'ToCall') {
		return {
			status,
			response: await replyApiRequest.call(ctx, 'PATCH', `/v3/contacts/${contactId}`, {
				callStatus: 'none',
			}),
		};
	}

	if (status === 'MeetingBooked') {
		return {
			status,
			response: await replyApiRequest.call(ctx, 'PATCH', `/v3/contacts/${contactId}`, {
				meetingStatus: 'none',
			}),
		};
	}

	return { status, response: { skipped: true } };
}

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const contactId = await resolveContactId(this, i);
	const requested = this.getNodeParameter('statuses', i, []) as string[];

	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const sequenceId = additionalFields.sequenceId
		? await resolveSequenceId.call(this, 'additionalFields.sequenceId', i)
		: undefined;

	const targets = requested.length > 0 ? requested : ALL_CLEARABLE;

	const results: Array<{ status: string; response: unknown }> = [];
	for (const status of targets) {
		results.push(await clearOne(this, contactId, status, sequenceId));
	}

	return [
		{
			json: {
				contactId,
				...(sequenceId !== undefined ? { sequenceId } : {}),
				cleared: results.map((r) => r.status),
				results,
			},
			pairedItem: i,
		},
	];
}
