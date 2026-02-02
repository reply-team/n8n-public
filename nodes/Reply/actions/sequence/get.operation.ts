import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { replyApiRequest, resolveSequenceId } from '../../utils/GenericFunctions';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const sequenceId = await resolveSequenceId.call(this, 'sequenceId', i);

	const response = await replyApiRequest.call(this, 'GET', `/v3/sequences/${sequenceId}`);
	return [{ json: response as IDataObject, pairedItem: i }];
}
