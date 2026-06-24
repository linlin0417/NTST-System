import { logger } from '../logger';
import { executeWorkflow } from '../engine';

// Throttling logic for Boot Scanner catch-up
const BOOT_TIME = Date.now();
const BOOT_LOW_CONCURRENCY_MS = 30 * 60 * 1000; // 30 minutes
const LOW_CONCURRENCY_LIMIT = 2; // only 2 workflows simultaneously
const NORMAL_CONCURRENCY_LIMIT = 10; // normal concurrency limit

let activeExecutions = 0;
const executionQueue: string[] = [];

export function enqueueExecution(executionLogId: string) {
    executionQueue.push(executionLogId);
    processQueue();
}

export async function processQueue() {
    const timeSinceBoot = Date.now() - BOOT_TIME;
    const limit = timeSinceBoot < BOOT_LOW_CONCURRENCY_MS ? LOW_CONCURRENCY_LIMIT : NORMAL_CONCURRENCY_LIMIT;

    while (activeExecutions < limit && executionQueue.length > 0) {
        const nextExecId = executionQueue.shift();
        if (nextExecId) {
            activeExecutions++;
            logger.info(`Starting execution ${nextExecId}. Active: ${activeExecutions}/${limit}`);
            // Fire and forget, we catch errors inside and call processQueue when done
            runExecutionTask(nextExecId).finally(() => {
                activeExecutions--;
                processQueue();
            });
        }
    }
}

async function runExecutionTask(execId: string) {
    try {
        await executeWorkflow(execId);
    } catch (error) {
        logger.error(`Error running execution ${execId}`, error);
    }
}
