import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { replyApiRequest } from '../../utils/GenericFunctions';
import { validateEmail } from '../../utils/validation';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const firstName = this.getNodeParameter('firstName', i) as string;
	const lastName = this.getNodeParameter('lastName', i, '') as string;
	const email = this.getNodeParameter('email', i, '') as string;
	const linkedInProfile = this.getNodeParameter('linkedInProfile', i, '') as string;
	const phone = this.getNodeParameter('phone', i, '') as string;
	const company = this.getNodeParameter('company', i, '') as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	if (!firstName || firstName.trim() === '') {
		throw new NodeOperationError(this.getNode(), 'First name is required', {
			itemIndex: i,
		});
	}

	const body: IDataObject = {
		firstName: firstName.trim(),
		...additionalFields,
	};

	if (lastName) body.lastName = lastName;
	if (email) {
		try {
			validateEmail(email);
		} catch (validationError) {
			throw new NodeOperationError(this.getNode(), (validationError as Error).message, {
				itemIndex: i,
			});
		}
		body.email = email;
	}
	if (linkedInProfile) body.linkedInProfile = linkedInProfile;
	if (phone) body.phone = phone;
	if (company) body.company = company;

	const response = await replyApiRequest.call(this, 'POST', '/v3/contacts', body);
	return [{ json: response as IDataObject, pairedItem: i }];
}
