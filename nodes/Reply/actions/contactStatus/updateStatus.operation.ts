import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { replyApiRequest, resolveContactId, resolveSequenceId } from '../../utils/GenericFunctions';

const SEQUENCE_STATUS_VALUES: Record<string, string> = {
	Active: 'active',
	Paused: 'paused',
	Finished: 'finished',
	OutOfOffice: 'outOfOffice',
};

const CALL_STATUS_VALUES: Record<string, string> = {
	Called: 'called',
	ToCall: 'toCall',
};

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const contactId = await resolveContactId(this, i);
	const status = this.getNodeParameter('status', i) as string;

	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const sequenceId = additionalFields.sequenceId
		? await resolveSequenceId.call(this, 'additionalFields.sequenceId', i)
		: undefined;

	const summary = (extra: IDataObject = {}) => ({
		success: true,
		contactId,
		status,
		...(sequenceId !== undefined ? { sequenceId } : {}),
		...extra,
	});

	let response: unknown;

	if (status in SEQUENCE_STATUS_VALUES) {
		const body: IDataObject = {
			contactIds: [contactId],
			statusInSequence: SEQUENCE_STATUS_VALUES[status],
		};
		const path = sequenceId
			? `/v3/sequences/${sequenceId}/contacts/set-status-in-sequence`
			: '/v3/contacts/set-status-in-sequence';
		response = await replyApiRequest.call(this, 'POST', path, body);
	} else if (status === 'Replied') {
		const body: IDataObject = { contactIds: [contactId], isReplied: true };
		const path = sequenceId
			? `/v3/sequences/${sequenceId}/contacts/set-replied`
			: '/v3/contacts/set-replied';
		response = await replyApiRequest.call(this, 'POST', path, body);
	} else if (status === 'Bounced') {
		const body: IDataObject = { contactIds: [contactId], isBounced: true };
		const path = sequenceId
			? `/v3/sequences/${sequenceId}/contacts/set-bounced`
			: '/v3/contacts/set-bounced';
		response = await replyApiRequest.call(this, 'POST', path, body);
	} else if (status === 'OptedOut') {
		response = await replyApiRequest.call(this, 'PATCH', `/v3/contacts/${contactId}`, {
			isOptedOut: true,
		});
	} else if (status in CALL_STATUS_VALUES) {
		response = await replyApiRequest.call(this, 'PATCH', `/v3/contacts/${contactId}`, {
			callStatus: CALL_STATUS_VALUES[status],
		});
	} else if (status === 'MeetingBooked') {
		response = await replyApiRequest.call(this, 'PATCH', `/v3/contacts/${contactId}`, {
			meetingStatus: 'meetingBooked',
		});
	} else {
		throw new NodeOperationError(this.getNode(), `Unsupported status: ${status}`, {
			itemIndex: i,
		});
	}

	return [
		{
			json: response ? (response as IDataObject) : summary({ message: `Contact status updated: ${status}` }),
			pairedItem: i,
		},
	];
}
