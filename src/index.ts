// Third-Party Imports
import { Client } from '@temporalio/client';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';

// Core Imports
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

  const client = new Client();
  const workflowId = `freight-delay-${randomUUID()}-${Date.now()}`;

  try {
    const response = await client.workflow.start(freightDelayWorkflow, {
      taskQueue: 'freight-delay-queue',
      workflowId,
      args: [input],
    });
    const result = await response?.result();

    console.log(`Workflow ${workflowId} completed`, result);

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

    console.log(`Result: ${result}`);
  } catch (error) {
    console.error(`Workflow execution failed:`, error);

    process.exit(1);
  }
};

if (require.main === module) {
  main().catch(console.error);
}
