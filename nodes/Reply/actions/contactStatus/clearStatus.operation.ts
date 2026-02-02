import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import { replyApiRequest, resolveContactId, resolveSequenceId } from '../../utils/GenericFunctions';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const contactId = await resolveContactId(this, i);
	const statuses = this.getNodeParameter('statuses', i, []) as string[];

	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const sequenceId = additionalFields.sequenceId
		? await resolveSequenceId.call(this, 'additionalFields.sequenceId', i)
		: undefined;

	const body: IDataObject = {
		contactIds: [contactId],
	};

	if (statuses.length > 0) {
		body.statuses = statuses;
	}

	if (sequenceId) {
		body.sequenceId = sequenceId;
	}

	try {
		const response = await replyApiRequest.call(this, 'PATCH', '/v3/contacts/status/clear', body);

		return [
			{
				json: response
					? (response as IDataObject)
					: {
							success: true,
							contactId,
							...(sequenceId && { sequenceId }),
							...(statuses.length > 0 ? { clearedStatuses: statuses } : { clearedAll: true }),
							message:
								statuses.length > 0
									? `Cleared statuses: ${statuses.join(', ')}`
									: 'Cleared all statuses',
						},
				pairedItem: i,
			},
		];
	} catch (error) {
		if (error instanceof NodeApiError) {
			const httpCode = (error as NodeApiError & { httpCode?: string }).httpCode;
			if (httpCode === '400') {
				return [{ json: { affected: [] }, pairedItem: i }];
			}
		}
		throw error;
	}
}
