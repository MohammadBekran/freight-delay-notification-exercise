// Third-Party Imports
import { z } from 'zod';

// Configuration schemas
export const RouteConfigSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  apiKey: z.string().min(1, 'Google Maps API key is required'),
});

export const NotificationConfigSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{10, 15}$/, 'Invalid phone number'),
  twilioSid: z.string().min(1).optional(),
  twilioAuthToken: z.string().min(1).optional(),
  twilioPhoneNumber: z
    .string()
    .regex(/^\+\d{10, 15}$/)
    .optional(),
});

export const WorkflowInputSchema = z.object({
  routeConfig: RouteConfigSchema,
  notificationConfig: NotificationConfigSchema,
  openAIApiKey: z.string().min(1, 'OpenAI API key is required'),
  delayThresholdMinuted: z
    .number()
    .min(0, 'Delay threshold muse be non-negetive'),
});
