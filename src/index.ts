// Third-Party Imports
import { Client, Connection } from '@temporalio/client';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';

// Core Imports
import { TASK_QUEUE } from './core/constants';
import type { TWorkflowInput, TWorkflowResult } from './core/types';
import { validateEnv } from './core/utils';
import { WorkflowInputSchema } from './core/validations';
import { freightDelayWorkflow } from './workflow';

config();

const env = validateEnv();

const startWorkflow = async (
  input: TWorkflowInput
): Promise<TWorkflowResult | undefined> => {
  const validatedInputResult = WorkflowInputSchema.safeParse(input);
  if (!validatedInputResult.success) {
    const errorMessage = 'Invalid workflow input';

    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const connection = await Connection.connect({
    address: env.TEMPORAL_ADDRESS,
    apiKey: env.TEMPORAL_API_KEY,
    connectTimeout: '30s',
    tls: {},
  });

  const client = new Client({
    connection,
    namespace: env.TEMPORAL_NAMESPACE,
  });

  const workflowId = `freight-delay-${randomUUID()}-${Date.now()}`;

  try {
    const response = await client.workflow.start(freightDelayWorkflow, {
      taskQueue: TASK_QUEUE,
      workflowId,
      args: [input],
    });
    const result = await response?.result();

    return result;
  } catch (error) {
    console.error(`Workflow ${workflowId} failed`, error);
  }
};

// Main function to execute the workflow
const main = async () => {
  const input: TWorkflowInput = {
    routeConfig: {
      origin: env.ORIGIN,
      destination: env.DESTINATION,
      apiKey: env.GOOGLE_MAPS_API_KEY,
    },
    notificationConfig: {
      phoneNumber: env.CUSTOMER_PHONE,
      twilioSid: env.TWILIO_SID,
      twilioAuthToken: env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: env.TWILIO_PHONE,
    },
    openAIApiKey: env.OPENAI_API_KEY,
    delayThresholdMinutes: env.DELAY_THRESHOLD,
  };

  try {
    const result = await startWorkflow(input);

    console.log('Result:', result);
  } catch (error) {
    console.error(`Workflow execution failed:`, error);

    process.exit(1);
  }
};

if (require.main === module) {
  main().catch(console.error);
}
