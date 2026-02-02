import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

import { publicUrls } from '../publicUrls';

export class ReplyApi implements ICredentialType {
	name = 'replyApi';

	displayName = 'Reply API';

	icon: Icon = {
		light: 'file:../icons/reply.svg',
		dark: 'file:../icons/reply.dark.svg',
	};

	documentationUrl = 'https://apidocs.reply.io/#authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: `${publicUrls.Reply2Api}/v3`,
			url: '/sequences',
			method: 'GET',
		},
	};
}
