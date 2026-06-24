import Fastify from 'fastify';
import cors from '@fastify/cors';
import { logger } from './logger';
import { prisma } from './db';

const fastify = Fastify({ logger: false });

fastify.register(cors, { origin: true });

// ─── Health ───
fastify.get('/ping', async () => {
  return { status: 'ok', message: 'NTST-System Backend is running' };
});

// ─── Dashboard Stats ───
fastify.get('/api/stats', async () => {
  const totalWorkflows = await prisma.workflow.count();
  const activeWorkflows = await prisma.workflow.count({ where: { is_active: true } });
  const totalExecutions = await prisma.executionLog.count();
  const successExecutions = await prisma.executionLog.count({ where: { status: 'SUCCESS' } });
  const failedExecutions = await prisma.executionLog.count({ where: { status: 'FAILED' } });

  return {
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    successExecutions,
    failedExecutions,
    successRate: totalExecutions > 0 ? ((successExecutions / totalExecutions) * 100).toFixed(1) : '0'
  };
});

// ─── Workflows CRUD ───
fastify.get('/api/workflows', async () => {
  return prisma.workflow.findMany({ orderBy: { created_at: 'desc' } });
});

fastify.post('/api/workflows', async (request, reply) => {
  const body: any = request.body;
  if (!body || !body.name) {
    return reply.status(400).send({ error: 'Missing workflow name' });
  }
  try {
    const workflow = await prisma.workflow.create({
      data: {
        name: body.name,
        description: body.description || null,
        cron_expression: body.cron_expression || null,
        nodes_config: JSON.stringify(body.nodes_config || {})
      }
    });
    return { success: true, workflow };
  } catch (err: any) {
    logger.error('Failed to create workflow', err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
});

// ─── Execution Logs ───
fastify.get('/api/executions', async (request) => {
  const query: any = request.query;
  const limit = parseInt(query.limit) || 20;
  return prisma.executionLog.findMany({
    orderBy: { created_at: 'desc' },
    take: limit,
    include: { workflow: { select: { name: true } } }
  });
});

// ─── Start Server ───
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    logger.info('Server listening on http://localhost:3000');
  } catch (err) {
    logger.error('Fastify failed to start', err);
    process.exit(1);
  }
};

start();
