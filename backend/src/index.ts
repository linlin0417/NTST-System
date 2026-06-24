import Fastify from 'fastify';
import cors from '@fastify/cors';
import { logger } from './logger';
import { startBootScanner } from './scheduler/bootScanner';
import { startCronScheduler } from './scheduler/cronScheduler';
import { prisma } from './db';

const fastify = Fastify({ logger: false });

fastify.register(cors, {
  origin: true
});

fastify.get('/ping', async (request, reply) => {
  return { status: 'ok', message: 'NTST-System Backend is running' };
});

fastify.post('/api/workflows', async (request, reply) => {
  const body: any = request.body;
  
  if (!body || !body.nodes || !body.edges) {
    return reply.status(400).send({ error: "Invalid workflow format" });
  }
  
  try {
      const workflow = await prisma.workflow.create({
        data: {
          name: body.name || "Untitled Workflow",
          nodes_config: JSON.stringify({ nodes: body.nodes, edges: body.edges })
        }
      });
      return { success: true, workflow };
  } catch (err: any) {
      logger.error("Failed to save workflow", err);
      return reply.status(500).send({ error: "Internal server error" });
  }
});

fastify.get('/api/workflows', async (request, reply) => {
  const workflows = await prisma.workflow.findMany({
    orderBy: { created_at: 'desc' }
  });
  return workflows;
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    logger.info(`Server listening on http://localhost:3000`);
    
    // Start background mechanisms
    await startBootScanner();
    startCronScheduler();

  } catch (err) {
    logger.error('Fastify failed to start', err);
    process.exit(1);
  }
};

start();
