// Third-Party Imports
import { proxyActivities } from '@temporalio/workflow';

// Core Imports
import { ACTIVITIES } from './activities';
import type { TWorkflowInput, TWorkflowResult } from './core/types';

const { getTrafficData, generateDelayMessage, sendNotification } =
  proxyActivities<typeof ACTIVITIES>({
    startToCloseTimeout: '2m',
    retry: {
      initialInterval: '1s',
      maximumAttempts: 3,
      backoffCoefficient: 2,
      maximumInterval: '30s',
    },
  });

export const freightDelayWorkflow = async (
  input: TWorkflowInput
): Promise<TWorkflowResult> => {
  console.log('Starting freight delay workflow');
  const {
    routeConfig,
    notificationConfig,
    openAIApiKey,
    delayThresholdMinutes,
  } = input;

  // Step 1: Fetch traffic data
  const { duration, durationInTraffic } = await getTrafficData(routeConfig);
  const delayMinutes = Math.round(
    Math.max(0, durationInTraffic - duration) / 60
  );
  console.log(`Estimated delay: ${delayMinutes} minutes`);

  // Step 2: Check delay threshold
  if (delayMinutes <= delayThresholdMinutes) {
    console.log('Delay within limits, no notification needed');

    return {
      status: 'skipped',
      delayMinutes,
    };
  }

  // Step 3: Generate AI message
  const message = await generateDelayMessage(delayMinutes, openAIApiKey);
  console.log(`Generated message: ${message}`);

  // Step 4: Send notification
  const sentNotification = await sendNotification(message, notificationConfig);

  return {
    status: sentNotification ? 'sent' : 'failed',
    delayMinutes,
    message,
  };
};
