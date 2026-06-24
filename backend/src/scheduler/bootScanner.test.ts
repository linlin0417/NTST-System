import { describe, it, expect, vi } from 'vitest';
import { calculateMissedCounts } from './bootScanner';

vi.mock('../db', () => ({ prisma: {} }));

describe('Boot Scanner Math', () => {
    it('should calculate missed counts for every minute cron', () => {
        const lastRun = new Date('2024-01-01T10:00:00Z');
        const now = new Date('2024-01-01T10:05:00Z');
        const missed = calculateMissedCounts('* * * * *', lastRun, now);
        expect(missed).toBeGreaterThanOrEqual(4);
        expect(missed).toBeLessThanOrEqual(5);
    });
});
