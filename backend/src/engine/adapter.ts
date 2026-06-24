export interface VueFlowNode {
    id: string;
    type: string;
    data: any;
    position: { x: number, y: number };
    [key: string]: any;
}

export interface VueFlowEdge {
    id: string;
    source: string;
    target: string;
    [key: string]: any;
}

export interface VueFlowJSON {
    nodes: VueFlowNode[];
    edges: VueFlowEdge[];
}

export interface ExecutionGraph {
    nodes: {
        [id: string]: {
            id: string;
            type: string;
            data: any;
        }
    };
    edges: {
        source: string;
        target: string;
    }[];
}

export function adaptVueFlowToExecutionGraph(flow: VueFlowJSON): ExecutionGraph {
    const graph: ExecutionGraph = {
        nodes: {},
        edges: []
    };

    if (Array.isArray(flow.nodes)) {
        for (const node of flow.nodes) {
            graph.nodes[node.id] = {
                id: node.id,
                type: node.type,
                data: node.data || {}
            };
        }
    }

    if (Array.isArray(flow.edges)) {
        for (const edge of flow.edges) {
            graph.edges.push({
                source: edge.source,
                target: edge.target
            });
        }
    }

    return graph;
}
