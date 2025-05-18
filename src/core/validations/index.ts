// Third-Party Imports
import { z } from 'zod';

// Configuration schemas
export const RouteConfigSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  accessToken: z.string().min(1, 'Mapbox access token is required'),
});

export const WorkflowInputSchema = z.object({
  routeConfig: RouteConfigSchema,
  openAIApiKey: z.string().min(1, 'OpenAI API key is required'),
  delayThresholdMinutes: z
    .number()
    .min(0, 'Delay threshold muse be non-negative'),
});

export const EnvSchema = z.object({
  ORIGIN: z.string().min(1),
  DESTINATION: z.string().min(1),
  MAPBOX_ACCESS_TOKEN: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  DELAY_THRESHOLD: z.string().transform(Number),
  TEMPORAL_API_KEY: z.string().min(1),
  TEMPORAL_NAMESPACE: z.string().min(1),
  TEMPORAL_ADDRESS: z.string().min(1),
});
