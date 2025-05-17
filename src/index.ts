// Third-Party Imports
import { Client } from '@temporalio/client';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';

// Core Imports
import type { TWorkflowInput, TWorkflowResult } from './core/types';
import { WorkflowInputSchema } from './core/validations';
import { freightDelayWorkflow } from './workflow';

config();

const startWorkflow = async (
  input: TWorkflowInput
): Promise<TWorkflowResult | undefined> => {
  try {
    WorkflowInputSchema.safeParse(input);
  } catch (error) {
    console.error(`Invalid workflow input:`, error);
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

// Main function
const main = async () => {
  const input: TWorkflowInput = {
    routeConfig: {
      origin: process.env.ORIGIN!,
      destination: process.env.DESTINATION!,
      apiKey: process.env.GOOGLE_MAPS_API_KEY!,
    },
    notificationConfig: {
      phoneNumber: process.env.CUSTOMER_PHONE!,
      twilioSid: process.env.TWILIO_SID!,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN!,
      twilioPhoneNumber: process.env.TWILIO_PHONE!,
    },
    openAIApiKey: process.env.OPENAI_API_KEY!,
    delayThresholdMinuted: +process.env.DELAY_THRESHOLD!,
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
