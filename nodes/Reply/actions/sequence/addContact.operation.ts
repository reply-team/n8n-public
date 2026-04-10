import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { replyApiRequest, resolveSequenceId, lookupContactByEmailOrLinkedIn, mapContactFieldsToV3, mapContactFieldsFromV3 } from '../../utils/GenericFunctions';

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const sequenceId = await resolveSequenceId.call(this, 'sequenceId', i);
	const firstName = this.getNodeParameter('firstName', i, '') as string;
	const lastName = this.getNodeParameter('lastName', i, '') as string;
	const email = this.getNodeParameter('email', i, '') as string;
	const linkedIn = this.getNodeParameter('linkedIn', i, '') as string;
	const phone = this.getNodeParameter('phone', i, '') as string;
	const company = this.getNodeParameter('company', i, '') as string;
	const forcePush = this.getNodeParameter('forcePush', i) as boolean;
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

	const lookup = await lookupContactByEmailOrLinkedIn(this, i, email, linkedIn);

	let contactId: number;

	if (lookup.found) {
		contactId = lookup.contactId!;
	} else {
		if (!firstName) {
			throw new NodeOperationError(
				this.getNode(),
				'Contact does not exist. Fill at least first name to create a new contact.',
				{ itemIndex: i },
			);
		}

		const contact: IDataObject = {
			firstName,
			...additionalFields,
		};
		if (lastName) contact.lastName = lastName;
		if (email) contact.email = email;
		if (linkedIn) contact.linkedInProfile = linkedIn;
		if (phone) contact.phone = phone;
		if (company) contact.company = company;

		const createResponse = (await replyApiRequest.call(
			this,
			'POST',
			'/v3/contacts',
			mapContactFieldsToV3(contact),
		)) as IDataObject;

		contactId = createResponse.id as number;
	}

	await replyApiRequest.call(
		this,
		'POST',
		`/v3/contacts/${contactId}/move-to-sequence`,
		{
			sequenceId,
			removeFromExisting: forcePush,
		},
	);

	// Refetch the full contact to get the complete model with updated sequence info
	const fullContact = (await replyApiRequest.call(
		this,
		'GET',
		`/v3/contacts/${contactId}`,
	)) as IDataObject;

	return [
		{
			json: mapContactFieldsFromV3(fullContact),
			pairedItem: i,
		},
	];
}
