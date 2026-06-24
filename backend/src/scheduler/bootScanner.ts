import { prisma } from '../db';
import { logger } from '../logger';
import { enqueueExecution } from './throttle';
import * as cron from 'cron-parser';
const parseExpression = (cron as any).parseExpression || (cron as any).default?.parseExpression;

export const startBootScanner = async () => {
    logger.info("Starting boot scanner...");
    const now = new Date();
    
    const missedWorkflows = await prisma.workflow.findMany({
        where: {
            is_active: true,
            next_run_time: {
                lt: now
            }
        }
    });

    if (missedWorkflows.length === 0) {
        logger.info("No missed workflows found.");
        return;
    }

    logger.info(`Found ${missedWorkflows.length} missed workflows. Applying catch-up strategies.`);

    for (const wf of missedWorkflows) {
        if (!wf.next_run_time || !wf.cron_expression) continue;

        if (wf.catch_up_strategy === 'SKIP') {
            logger.info(`Skipping missed workflow ${wf.id}`);
            await prisma.workflow.update({
                where: { id: wf.id },
                data: { next_run_time: calculateNextRun(wf.cron_expression, now) }
            });
            continue;
        }

        if (wf.catch_up_strategy === 'RUN_ONCE') {
            logger.info(`Run once for missed workflow ${wf.id}`);
            await createPendingExecution(wf.id, now);
            await prisma.workflow.update({
                where: { id: wf.id },
                data: { next_run_time: calculateNextRun(wf.cron_expression, now) }
            });
            continue;
        }

        if (wf.catch_up_strategy === 'RUN_ALL') {
            const missedTimes = calculateMissedCounts(wf.cron_expression, wf.next_run_time, now);
            logger.info(`Workflow ${wf.id} missed ${missedTimes} times. Scheduling RUN_ALL.`);
            // Throttle massive missed counts to a sane max limit per boot to avoid DB explosion
            const safeMissedTimes = Math.min(missedTimes, 100); 
            for(let i=0; i<safeMissedTimes; i++) {
                await createPendingExecution(wf.id, now);
            }
            await prisma.workflow.update({
                where: { id: wf.id },
                data: { next_run_time: calculateNextRun(wf.cron_expression, now) }
            });
            continue;
        }
    }
};

async function createPendingExecution(workflowId: string, triggerTime: Date) {
    const exec = await prisma.executionLog.create({
        data: {
            workflow_id: workflowId,
            status: 'PENDING',
            trigger_time: triggerTime
        }
    });
    enqueueExecution(exec.id);
}

export function calculateNextRun(cronStr: string, from: Date): Date | null {
    try {
        const interval = parseExpression(cronStr, { currentDate: from });
        return interval.next().toDate();
    } catch (err) {
        logger.error(`Invalid cron expression: ${cronStr}`);
        return null;
    }
}

export function calculateMissedCounts(cronStr: string, lastRun: Date, now: Date): number {
    try {
        const options = { currentDate: lastRun, endDate: now };
        const interval = parseExpression(cronStr, options);
        let count = 0;
        while (true) {
            try {
                interval.next();
                count++;
            } catch (e) {
                break;
            }
        }
        return count;
    } catch (err) {
        console.error("calculateMissedCounts Error:", err);
        return 0;
    }
}
