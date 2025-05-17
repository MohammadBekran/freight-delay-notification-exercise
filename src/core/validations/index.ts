// Third-Party Imports
import { z } from 'zod';

// Configuration schemas
export const RouteConfigSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  apiKey: z.string().min(1, 'Google Maps API key is required'),
});

export const NotificationConfigSchema = z.object({
  phoneNumber: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number'),
  twilioSid: z.string().min(1).optional(),
  twilioAuthToken: z.string().min(1).optional(),
  twilioPhoneNumber: z
    .string()
    .regex(/^\+\d{10,15}$/)
    .optional(),
});

export const WorkflowInputSchema = z.object({
  routeConfig: RouteConfigSchema,
  notificationConfig: NotificationConfigSchema,
  openAIApiKey: z.string().min(1, 'OpenAI API key is required'),
  delayThresholdMinutes: z
    .number()
    .min(0, 'Delay threshold muse be non-negative'),
});

export const EnvSchema = z.object({
  ORIGIN: z.string().min(1),
  DESTINATION: z.string().min(1),
  GOOGLE_MAPS_API_KEY: z.string().min(1),
  CUSTOMER_PHONE: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number'),
  TWILIO_SID: z.string().min(1),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_PHONE: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number'),
  OPENAI_API_KEY: z.string().min(1),
  DELAY_THRESHOLD: z.string().transform(Number),
});
