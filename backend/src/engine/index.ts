import { prisma } from '../db';
import { logger } from '../logger';
import { adaptVueFlowToExecutionGraph, ExecutionGraph } from './adapter';
import { WebhookNode } from './nodes/WebhookNode';
import { HttpRequestNode } from './nodes/HttpRequestNode';
import { DataTransformNode } from './nodes/DataTransformNode';
import { DatabaseNode } from './nodes/DatabaseNode';

function createNodeInstance(nodeDef: any) {
    switch (nodeDef.type) {
        case 'webhook': return new WebhookNode(nodeDef.id, nodeDef.data);
        case 'http': return new HttpRequestNode(nodeDef.id, nodeDef.data);
        case 'transform': return new DataTransformNode(nodeDef.id, nodeDef.data);
        case 'database': return new DatabaseNode(nodeDef.id, nodeDef.data);
        default: throw new Error(`Unknown node type: ${nodeDef.type}`);
    }
}

export function topologicalSort(graph: ExecutionGraph): string[] {
    const inDegree: { [id: string]: number } = {};
    const adj: { [id: string]: string[] } = {};
    const nodes = Object.keys(graph.nodes);

    nodes.forEach(id => {
        inDegree[id] = 0;
        adj[id] = [];
    });

    graph.edges.forEach(edge => {
        adj[edge.source].push(edge.target);
        inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
    });

    const queue: string[] = [];
    nodes.forEach(id => {
        if (inDegree[id] === 0) queue.push(id);
    });

    const order: string[] = [];
    while (queue.length > 0) {
        const u = queue.shift()!;
        order.push(u);
        adj[u].forEach(v => {
            inDegree[v]--;
            if (inDegree[v] === 0) queue.push(v);
        });
    }

    if (order.length !== nodes.length) {
        throw new Error("Cycle detected in DAG");
    }

    return order;
}

export async function executeWorkflow(executionLogId: string) {
    logger.info(`Engine starting execution for log ${executionLogId}`);
    
    await prisma.executionLog.update({
        where: { id: executionLogId },
        data: { status: 'RUNNING' }
    });

    try {
        const execLog = await prisma.executionLog.findUnique({
            where: { id: executionLogId },
            include: { workflow: true }
        });

        if (!execLog || !execLog.workflow) {
            throw new Error(`Execution log or workflow not found: ${executionLogId}`);
        }

        const vueFlowJson = JSON.parse(execLog.workflow.nodes_config || '{"nodes":[],"edges":[]}');
        const graph = adaptVueFlowToExecutionGraph(vueFlowJson);
        const order = topologicalSort(graph);

        const context: any = {};

        for (const nodeId of order) {
            const nodeDef = graph.nodes[nodeId];
            const nodeInstance = createNodeInstance(nodeDef);
            const result = await nodeInstance.execute(context);
            context[nodeId] = result;
        }

        await prisma.executionLog.update({
            where: { id: executionLogId },
            data: { status: 'SUCCESS', completed_at: new Date(), log_details: JSON.stringify(context) }
        });
        logger.info(`Execution ${executionLogId} SUCCESS`);

    } catch (err: any) {
        logger.error(`Execution ${executionLogId} FAILED`, err);
        await prisma.executionLog.update({
            where: { id: executionLogId },
            data: { status: 'FAILED', completed_at: new Date(), log_details: JSON.stringify({ error: err.message }) }
        });
    }
}
