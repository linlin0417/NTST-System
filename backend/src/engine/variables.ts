function get(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function interpolateVariables(template: string, context: any): string {
    if (typeof template !== 'string') return template;
    return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, path) => {
        const val = get(context, path);
        return val !== undefined && val !== null ? String(val) : match;
    });
}

export function deepInterpolate(obj: any, context: any): any {
    if (typeof obj === 'string') return interpolateVariables(obj, context);
    if (Array.isArray(obj)) return obj.map(item => deepInterpolate(item, context));
    if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            result[key] = deepInterpolate(obj[key], context);
        }
        return result;
    }
    return obj;
}
