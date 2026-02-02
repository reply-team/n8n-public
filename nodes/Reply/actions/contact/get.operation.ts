import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { replyApiRequest, resolveContactId } from '../../utils/GenericFunctions';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const contactId = await resolveContactId(this, i);

	const response = await replyApiRequest.call(this, 'GET', `/v3/contacts/${contactId}`);

	return [{ json: response as IDataObject, pairedItem: i }];
}
