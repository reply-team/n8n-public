import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';

import { replyApiRequest } from '../../utils/GenericFunctions';
import { mapPagination } from '../../utils/mappings';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const offset = this.getNodeParameter('offset', i, 0) as number;
	const status = this.getNodeParameter('status', i, '') as number | '';

	const pagination = mapPagination({ limit, offset });
	const qs: IDataObject = { top: pagination.top, skip: pagination.skip };

	if (status !== '') {
		qs.status = status;
	}

	const response = (await replyApiRequest.call(
		this,
		'GET',
		'/v3/sequences',
		undefined,
		qs,
	)) as IDataObject;

	const sequences = (response.items as IDataObject[]) || [];
	return sequences.map((sequence) => ({ json: sequence, pairedItem: i }));
}
