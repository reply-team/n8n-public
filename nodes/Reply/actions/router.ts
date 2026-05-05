import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { operations as contactOperations } from './contact';
import { operations as contactStatusOperations } from './contactStatus';
import { operations as sequenceOperations } from './sequence';

type OperationModule = {
	execute: (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData[]>;
};

type OperationsMap = Record<string, OperationModule>;

const resourceOperations: Record<string, OperationsMap> = {
	contact: contactOperations,
	contactStatus: contactStatusOperations,
	sequence: sequenceOperations,
};

export async function dispatchOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	const operations = resourceOperations[resource];
	if (!operations) {
		throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
	}

	const operationHandler = operations[operation];
	if (!operationHandler) {
		throw new NodeOperationError(
			this.getNode(),
			`Unknown operation '${operation}' for resource '${resource}'`,
		);
	}

	return operationHandler.execute.call(this, i);
}
