import { calculateWorkflowChecksum, type WorkflowSnapshot } from '../src/workflow-checksum';

const baseWorkflow: WorkflowSnapshot = {
	name: 'Null snapshot fields',
	nodes: [],
	connections: {},
};

describe('calculateWorkflowChecksum null snapshot fields', () => {
	it('should hash a missing description the same as an explicit null', async () => {
		const missing: WorkflowSnapshot = { ...baseWorkflow };
		const explicitNull: WorkflowSnapshot = { ...baseWorkflow, description: null };

		expect(await calculateWorkflowChecksum(explicitNull)).toBe(
			await calculateWorkflowChecksum(missing),
		);
	});

	it('should hash a missing activeVersionId the same as an explicit null', async () => {
		const missing: WorkflowSnapshot = { ...baseWorkflow };
		const explicitNull: WorkflowSnapshot = { ...baseWorkflow, activeVersionId: null };

		expect(await calculateWorkflowChecksum(explicitNull)).toBe(
			await calculateWorkflowChecksum(missing),
		);
	});

	it('should still distinguish a real description from an absent one', async () => {
		const withDescription: WorkflowSnapshot = { ...baseWorkflow, description: 'Nightly sync' };
		const missing: WorkflowSnapshot = { ...baseWorkflow };

		expect(await calculateWorkflowChecksum(withDescription)).not.toBe(
			await calculateWorkflowChecksum(missing),
		);
	});

	it('should still distinguish a real activeVersionId from an absent one', async () => {
		const withId: WorkflowSnapshot = { ...baseWorkflow, activeVersionId: 'v-42' };
		const missing: WorkflowSnapshot = { ...baseWorkflow };

		expect(await calculateWorkflowChecksum(withId)).not.toBe(
			await calculateWorkflowChecksum(missing),
		);
	});

	it('should keep nested null values significant', async () => {
		const withNestedNull: WorkflowSnapshot = { ...baseWorkflow, meta: { note: null } };
		const withoutNestedNull: WorkflowSnapshot = { ...baseWorkflow, meta: {} };

		expect(await calculateWorkflowChecksum(withNestedNull)).not.toBe(
			await calculateWorkflowChecksum(withoutNestedNull),
		);
	});
});
