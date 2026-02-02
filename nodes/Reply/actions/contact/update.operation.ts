import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { replyApiRequest, resolveContactId } from '../../utils/GenericFunctions';
import { validateEmail } from '../../utils/validation';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const contactId = await resolveContactId(this, i);

	const firstName = this.getNodeParameter('firstName', i, '') as string;
	const lastName = this.getNodeParameter('lastName', i, '') as string;
	const email = this.getNodeParameter('updateEmail', i, '') as string;
	const linkedInProfile = this.getNodeParameter('updateLinkedInProfile', i, '') as string;
	const phone = this.getNodeParameter('phone', i, '') as string;
	const company = this.getNodeParameter('company', i, '') as string;
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const updateFields: IDataObject = { ...additionalFields };

	if (firstName) updateFields.firstName = firstName;
	if (lastName) updateFields.lastName = lastName;
	if (phone) updateFields.phone = phone;
	if (company) updateFields.company = company;
	if (linkedInProfile) updateFields.linkedInProfile = linkedInProfile;

	if (email) {
		try {
			validateEmail(email);
		} catch (validationError) {
			throw new NodeOperationError(this.getNode(), (validationError as Error).message, {
				itemIndex: i,
			});
		}
		updateFields.email = email;
	}

	if (Object.keys(updateFields).length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one field is required to update', {
			itemIndex: i,
		});
	}

	const response = await replyApiRequest.call(
		this,
		'PATCH',
		`/v3/contacts/${contactId}`,
		updateFields,
	);

	return [{ json: response as IDataObject, pairedItem: i }];
}
