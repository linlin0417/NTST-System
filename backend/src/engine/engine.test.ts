import { describe, it, expect, vi } from 'vitest';
import { topologicalSort } from './index';

vi.mock('../db', () => ({ prisma: {} }));

describe('DAG Topological Sorter', () => {
    it('should sort nodes correctly', () => {
        const graph = {
            nodes: {
                '1': { id: '1', type: 'webhook', data: {} },
                '2': { id: '2', type: 'transform', data: {} },
                '3': { id: '3', type: 'database', data: {} }
            },
            edges: [
                { source: '1', target: '2' },
                { source: '2', target: '3' }
            ]
        };
        const order = topologicalSort(graph as any);
        expect(order).toEqual(['1', '2', '3']);
    });

    it('should throw error on cyclic dependencies', () => {
        const graph = {
            nodes: {
                '1': { id: '1', type: 'webhook', data: {} },
                '2': { id: '2', type: 'transform', data: {} }
            },
            edges: [
                { source: '1', target: '2' },
                { source: '2', target: '1' }
            ]
        };
        expect(() => topologicalSort(graph as any)).toThrowError('Cycle detected in DAG');
    });
});
