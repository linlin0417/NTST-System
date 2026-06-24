import { BaseNode } from './BaseNode';
import { logger } from '../../logger';
import { deepInterpolate } from '../variables';
import { prisma } from '../../db';

export class DatabaseNode extends BaseNode {
    async execute(context: any): Promise<any> {
        const config = deepInterpolate(this.data, context);
        const action = config.action; // 'CREATE', 'READ', 'UPDATE', 'DELETE'
        const model = config.model; 
        const payload = config.payload;

        logger.info(`[DatabaseNode ${this.id}] ${action} on ${model}`);
        
        if (model === 'Workflow') {
            if (action === 'READ') {
                return await prisma.workflow.findMany({ where: payload });
            }
        }
        
        return { success: true, note: "Database MVP placeholder executed" };
    }
}
