import { prisma } from '../db';
import { logger } from '../logger';
import { enqueueExecution } from './throttle';
import parser from 'cron-parser';

let pollingInterval: NodeJS.Timeout;

export const startCronScheduler = () => {
    logger.info("Starting cron scheduler polling...");
    // Poll every 10 seconds
    pollingInterval = setInterval(pollWorkflows, 10000);
};

export const stopCronScheduler = () => {
    clearInterval(pollingInterval);
};

async function pollWorkflows() {
    const now = new Date();
    // Find all active workflows that are due
    const dueWorkflows = await prisma.workflow.findMany({
        where: {
            is_active: true,
            next_run_time: {
                lte: now
            }
        }
    });

    for (const wf of dueWorkflows) {
        if (!wf.cron_expression) continue;
        
        logger.info(`Workflow ${wf.id} is due for execution.`);
        
        // Create execution log
        const exec = await prisma.executionLog.create({
            data: {
                workflow_id: wf.id,
                status: 'PENDING',
                trigger_time: now
            }
        });
        enqueueExecution(exec.id);

        // Update next run time
        try {
            const interval = parser.parseExpression(wf.cron_expression, { currentDate: now });
            const nextRun = interval.next().toDate();
            await prisma.workflow.update({
                where: { id: wf.id },
                data: { next_run_time: nextRun }
            });
        } catch (e) {
            logger.error(`Error updating next_run_time for wf ${wf.id}`, e);
        }
    }
}
