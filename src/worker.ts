// Third-Party Imports
import { NativeConnection, Worker } from '@temporalio/worker';
import { config } from 'dotenv';

// Core Imports
import { ACTIVITIES } from './activities';
import { TASK_QUEUE } from './core/constants';
import { validateEnv } from './core/utils';

config();

const env = validateEnv();

const run = async () => {
  const connection = await NativeConnection.connect({
    address: env.TEMPORAL_ADDRESS,
    apiKey: env.TEMPORAL_API_KEY,
    tls: {},
  });

  const worker = await Worker.create({
    connection,
    namespace: env.TEMPORAL_NAMESPACE,
    workflowsPath: require.resolve('./workflow'),
    activities: ACTIVITIES,
    taskQueue: TASK_QUEUE,
  });

  console.log('Worker started...');
  await worker.run();
};

if (require.main === module) {
  run().catch((error) => {
    console.error('Worker failed:', error);

    process.exit(1);
  });
}
