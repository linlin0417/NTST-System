import { describe, it, expect } from 'vitest';
import { interpolateVariables, deepInterpolate } from './variables';

describe('Variables Interpolator', () => {
    it('should interpolate simple string', () => {
        const context = { A: { data: 'hello' } };
        const result = interpolateVariables('Say {{ A.data }} world', context);
        expect(result).toBe('Say hello world');
    });

    it('should handle missing keys gracefully', () => {
        const context = { A: {} };
        const result = interpolateVariables('Say {{ A.data }} world', context);
        expect(result).toBe('Say {{ A.data }} world');
    });

    it('should deep interpolate objects', () => {
        const context = { user: { id: 123 } };
        const obj = { url: '/api/users/{{ user.id }}', body: { u: '{{ user.id }}' } };
        const result = deepInterpolate(obj, context);
        expect(result.url).toBe('/api/users/123');
        expect(result.body.u).toBe('123');
    });
});
