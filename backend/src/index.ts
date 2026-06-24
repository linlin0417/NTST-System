import Fastify from 'fastify';
import { logger } from './logger';
import { startBootScanner } from './scheduler/bootScanner';
import { startCronScheduler } from './scheduler/cronScheduler';

const fastify = Fastify({ logger: false });

fastify.get('/ping', async (request, reply) => {
  return { status: 'ok', message: 'NTST-System Backend is running' };
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
