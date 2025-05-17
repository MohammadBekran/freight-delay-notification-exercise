// Third-Party Imports
import { z } from 'zod';

// Core Imports
import {
  NotificationConfigSchema,
  RouteConfigSchema,
  WorkflowInputSchema,
} from '../validations';

// Types for configurations
export type TRouteConfig = z.infer<typeof RouteConfigSchema>;
export type TNotificationConfig = z.infer<typeof NotificationConfigSchema>;
export type TWorkflowInput = z.infer<typeof WorkflowInputSchema>;

export type TMetric = {
  name: string;
  help: string;
  labelNames?: string[];
};

export type TTrafficResponse = {
  duration: number;
  durationInTraffic: number;
  distance: number;
};

export type TWorkflowStatus = 'sent' | 'failed' | 'skipped';

export type TWorkflowResult = {
  status: TWorkflowStatus;
  delayMinutes: number;
  message?: string;
};
