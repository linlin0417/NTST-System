import { BaseNode } from './BaseNode';
import { logger } from '../../logger';
import { deepInterpolate } from '../variables';

export class WebhookNode extends BaseNode {
    async execute(context: any): Promise<any> {
        // Interpolate data with context
        const config = deepInterpolate(this.data, context);
        const url = config.url;
        const payload = config.payload;
        
        if (!url) throw new Error("Webhook URL is required");

        logger.info(`[WebhookNode ${this.id}] Sending payload to ${url}`);
        
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return {
                status: res.status,
                ok: res.ok
            };
        } catch (error: any) {
            logger.error(`[WebhookNode ${this.id}] Failed`, error);
            throw error;
        }
    }
}
