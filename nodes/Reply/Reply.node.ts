import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchItems,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { replyApiRequest } from './utils/GenericFunctions';

import { router } from './actions/router';
import { description as contactDescription } from './actions/contact';
import { description as contactStatusDescription } from './actions/contactStatus';
import { description as sequenceDescription } from './actions/sequence';

export class Reply implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Reply',
		name: 'reply',
		icon: { light: 'file:../../icons/reply.svg', dark: 'file:../../icons/reply.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Reply.io API',
		defaults: {
			name: 'Reply',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'replyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Contact Status',
						value: 'contactStatus',
					},
					{
						name: 'Sequence',
						value: 'sequence',
					},
				],
				default: 'contact',
			},
			...contactDescription,
			...contactStatusDescription,
			...sequenceDescription,
		],
	};

	methods = {
		listSearch: {
			async searchSequences(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const response = (await replyApiRequest.call(
					this,
					'GET',
					'/v3/sequences',
					undefined,
					{ top: 100 },
				)) as IDataObject;

				const sequences = (response.items as IDataObject[]) || [];

				const results: INodeListSearchItems[] = sequences
					.filter((seq) => {
						if (!filter) return true;
						const name = (seq.name as string) || '';
						return name.toLowerCase().includes(filter.toLowerCase());
					})
					.map((seq) => ({
						name: (seq.name as string) || `Sequence ${seq.id}`,
						value: seq.id as number,
					}));

				return { results };
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return router.call(this);
	}
}
