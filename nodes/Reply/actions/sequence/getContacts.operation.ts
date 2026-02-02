import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { replyApiRequest, resolveSequenceId } from '../../utils/GenericFunctions';
import { mapPagination } from '../../utils/mappings';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const sequenceId = await resolveSequenceId.call(this, 'sequenceId', i);
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const offset = this.getNodeParameter('offset', i, 0) as number;

	const pagination = mapPagination({ limit, offset });
	const qs: IDataObject = { top: pagination.top, skip: pagination.skip };

	const response = (await replyApiRequest.call(
		this,
		'GET',
		`/v3/sequences/${sequenceId}/contacts`,
		undefined,
		qs,
	)) as IDataObject;

	const contacts = (response.items as IDataObject[]) || [];
	return contacts.map((contact) => ({ json: contact, pairedItem: i }));
}
