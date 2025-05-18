// Core Imports
import type { TEnvConfig } from '../types';
import { EnvSchema } from '../validations';

export const validateEnv = (): TEnvConfig => {
  const validatedEnvResult = EnvSchema.safeParse(process.env);
  if (!validatedEnvResult.success) {
    const errorMessage = `Environment variables validation failed: ${validatedEnvResult.error.message}`;

    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return validatedEnvResult.data;
};
