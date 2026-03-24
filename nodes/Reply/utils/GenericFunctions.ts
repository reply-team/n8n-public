import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { publicUrls } from '../../../publicUrls';
import { version as nodeVersion } from '../../../package.json';

type ReplyApiContext =
	| IExecuteFunctions
	| IWebhookFunctions
	| IHookFunctions
	| ILoadOptionsFunctions;

interface RequestOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	baseUrl: string;
	body?: IDataObject;
	qs?: IDataObject;
	headers?: IDataObject;
}

async function makeRequest<T = unknown>(
	this: ReplyApiContext,
	options: RequestOptions,
): Promise<T> {
	const credentials = await this.getCredentials('replyApi');

	if (!credentials?.apiKey || typeof credentials.apiKey !== 'string') {
		throw new NodeApiError(this.getNode(), {
			message: 'Reply API credential is required',
			description: 'Please configure the Reply API credential with a valid API key',
		} as JsonObject);
	}

	const apiKey = credentials.apiKey.trim();

	if (!apiKey) {
		throw new NodeApiError(this.getNode(), {
			message: 'Reply API credential is required',
			description: 'Please configure the Reply API credential with a valid API key',
		} as JsonObject);
	}

	const requestOptions: IHttpRequestOptions = {
		method: options.method,
		url: `${options.baseUrl}${options.endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			'x-n8n-node-version': `${nodeVersion}`,
			...options.headers,
		},
		json: true,
	};

	if (options.body && Object.keys(options.body).length > 0) {
		requestOptions.body = options.body;
	}

	if (options.qs && Object.keys(options.qs).length > 0) {
		requestOptions.qs = options.qs;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'replyApi', requestOptions);
	} catch (error: unknown) {
		throw parseReplyApiError.call(this, error);
	}
}

export async function replyApiRequest<T = unknown>(
	this: ReplyApiContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	headers?: IDataObject,
): Promise<T> {
	return makeRequest.call<ReplyApiContext, [RequestOptions], Promise<T>>(this, {
		method,
		endpoint,
		baseUrl: publicUrls.Reply2Api,
		body,
		qs,
		headers,
	});
}

export async function replyWebhookApiRequest<T = unknown>(
	this: ReplyApiContext,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
): Promise<T> {
	return makeRequest.call<ReplyApiContext, [RequestOptions], Promise<T>>(this, {
		method,
		endpoint,
		baseUrl: publicUrls.ReplyWebhookApi,
		body,
	});
}

export async function resolveSequenceId(
	this: IExecuteFunctions,
	parameterName: string,
	itemIndex: number,
): Promise<number> {
	const mode = this.getNodeParameter(`${parameterName}.mode`, itemIndex) as string;
	const value = this.getNodeParameter(parameterName, itemIndex, undefined, {
		extractValue: true,
	}) as string | number;

	if (mode === 'list' || mode === 'id') {
		const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
		if (isNaN(parsed)) {
			throw new NodeApiError(this.getNode(), {
				message: `Invalid sequence ID: "${value}"`,
			} as JsonObject);
		}
		return parsed;
	}

	if (mode === 'name') {
		const response = (await replyApiRequest.call(this, 'GET', '/v3/sequences', undefined, {
			name: value,
			top: 1,
		})) as IDataObject;

		const sequences = (response.items as IDataObject[]) || [];

		if (sequences.length === 0) {
			throw new NodeApiError(this.getNode(), {
				message: `Sequence with name "${value}" not found`,
			} as JsonObject);
		}

		return sequences[0].id as number;
	}

	const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
	if (isNaN(parsed)) {
		throw new NodeApiError(this.getNode(), {
			message: `Invalid sequence ID: "${value}"`,
		} as JsonObject);
	}
	return parsed;
}

export interface ContactLookupResult {
	found: boolean;
	contactId?: number;
	contact?: IDataObject;
}

export async function lookupContactByEmailOrLinkedIn(
	ctx: IExecuteFunctions,
	i: number,
	email?: string,
	linkedIn?: string,
): Promise<ContactLookupResult> {
	if (!email && !linkedIn) {
		throw new NodeOperationError(ctx.getNode(), 'Either email or LinkedIn is required', {
			itemIndex: i,
		});
	}

	const qs: IDataObject = {};
	if (email) qs.email = email;
	else if (linkedIn) qs.linkedIn = linkedIn;

	const response = (await replyApiRequest.call(
		ctx,
		'GET',
		'/v3/contacts',
		undefined,
		qs,
	)) as IDataObject;

	const contacts = (response.items as IDataObject[]) || [];

	if (contacts.length === 0) {
		return { found: false };
	}

	return {
		found: true,
		contactId: contacts[0].id as number,
		contact: contacts[0],
	};
}

export async function resolveContactId(ctx: IExecuteFunctions, i: number): Promise<number> {
	const contactLocator = ctx.getNodeParameter('contactLocator', i, undefined, {
		extractValue: true,
	}) as string;
	const locatorMode = ctx.getNodeParameter('contactLocator.mode', i) as string;

	const throwNotFound = () => {
		throw new NodeOperationError(
			ctx.getNode(),
			`Contact with ${locatorMode} "${contactLocator}" not found`,
			{ itemIndex: i },
		);
	};

	if (locatorMode === 'id') {
		const contactId = parseInt(contactLocator, 10);
		if (isNaN(contactId) || contactId <= 0) {
			throw new NodeOperationError(ctx.getNode(), 'Contact ID must be a positive number', {
				itemIndex: i,
			});
		}
		try {
			await replyApiRequest.call(ctx, 'GET', `/v3/contacts/${contactId}`);
		} catch (error) {
			if (
				error instanceof NodeApiError &&
				(error as NodeApiError & { httpCode?: string }).httpCode === '404'
			) {
				throwNotFound();
			}
			throw error;
		}
		return contactId;
	}

	const qs: IDataObject = {};
	if (locatorMode === 'email') {
		qs.email = contactLocator;
	} else if (locatorMode === 'linkedIn') {
		qs.linkedIn = contactLocator;
	}

	const response = (await replyApiRequest.call(
		ctx,
		'GET',
		'/v3/contacts',
		undefined,
		qs,
	)) as IDataObject;

	const contacts = (response.items as IDataObject[]) || [];

	if (contacts.length === 0) {
		throwNotFound();
	}

	return contacts[0].id as number;
}

function parseReplyApiError(this: ReplyApiContext, error: unknown): NodeApiError {
	const err = error as {
		message?: string;
		response?: { body?: unknown; data?: unknown };
		cause?: { response?: { body?: unknown; data?: unknown } };
		body?: unknown;
		data?: unknown;
	};

	let responseBody: IDataObject | undefined;
	const rawBody =
		err.response?.body ??
		err.response?.data ??
		err.cause?.response?.body ??
		err.cause?.response?.data ??
		err.body ??
		err.data;

	if (typeof rawBody === 'string') {
		try {
			responseBody = JSON.parse(rawBody);
		} catch {
			responseBody = undefined;
		}
	} else if (typeof rawBody === 'object' && rawBody !== null) {
		responseBody = rawBody as IDataObject;
	}

	const statusCode = (responseBody?.status as number) ?? 500;
	const replyMessage = (responseBody?.detail as string) ?? err.message ?? 'Unknown error';
	const prefix = statusCode >= 500 ? 'Reply API server error' : 'Reply API error';

	return new NodeApiError(this.getNode(), {
		message: `${prefix} (${statusCode}): ${replyMessage}`,
		httpCode: String(statusCode),
	} as JsonObject);
}
