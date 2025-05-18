// Third-Party Imports
import { z } from 'zod';

// Core Imports
import {
  EnvSchema,
  RouteConfigSchema,
  WorkflowInputSchema,
} from '../validations';

// Types for configurations
export type TRouteConfig = z.infer<typeof RouteConfigSchema>;
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

export type TMapboxResponse = {
  routes: {
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
    legs: [];
    geometry: [];
  }[];
  waypoints: { distance: 0; name: 'West Madison Street'; location: [] }[];
  code: string;
  uuid: string;
};

export type TWorkflowStatus = 'sent' | 'failed' | 'skipped';

export type TWorkflowResult = {
  status: TWorkflowStatus;
  delayMinutes: number;
  message?: string;
};

export type TEnvConfig = z.infer<typeof EnvSchema>;
