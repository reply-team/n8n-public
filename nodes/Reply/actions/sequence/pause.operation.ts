import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { replyApiRequest, resolveSequenceId } from '../../utils/GenericFunctions';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const sequenceId = await resolveSequenceId.call(this, 'sequenceId', i);

	const response = await replyApiRequest.call(this, 'POST', `/v3/sequences/${sequenceId}/pause`);
	return [
		{
			json: response
				? (response as IDataObject)
				: { success: true, sequenceId, message: 'Sequence paused' },
			pairedItem: i,
		},
	];
}
