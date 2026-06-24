import { BaseNode } from './BaseNode';
import { logger } from '../../logger';
import { deepInterpolate } from '../variables';

export class HttpRequestNode extends BaseNode {
    async execute(context: any): Promise<any> {
        const config = deepInterpolate(this.data, context);
        const url = config.url;
        const method = config.method || 'GET';
        const headers = config.headers || {};
        const body = config.body;

        if (!url) throw new Error("HTTP Request URL is required");

        logger.info(`[HttpRequestNode ${this.id}] ${method} ${url}`);
        
        try {
            const res = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });
            const text = await res.text();
            let json;
            try { json = JSON.parse(text); } catch(e) { }
            
            return {
                status: res.status,
                data: json || text
            };
        } catch (error: any) {
            logger.error(`[HttpRequestNode ${this.id}] Failed`, error);
            throw error;
        }
    }
}
