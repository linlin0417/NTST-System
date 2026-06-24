import { BaseNode } from './BaseNode';
import { logger } from '../../logger';
import { deepInterpolate } from '../variables';

export class DataTransformNode extends BaseNode {
    async execute(context: any): Promise<any> {
        const config = deepInterpolate(this.data, context);
        logger.info(`[DataTransformNode ${this.id}] Transforming data`);
        return config.mapping || config;
    }
}
