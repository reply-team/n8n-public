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

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

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

	for (let i = 0; i < items.length; i++) {
		try {
			const results = await operationHandler.execute.call(this, i);
			returnData.push(...results);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: i });
			} else {
				if ((error as NodeOperationError).context) {
					throw error;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}
	}

	return [returnData];
}
