// Third-Party Imports
import { AxiosError } from 'axios';

// Core Imports
import { METRICS } from './core/constants';
import {
  generateFriendlyDelayMessage,
  geocodeAddress,
  mapboxDirections,
} from './core/services/api';
import type { TRouteConfig, TTrafficResponse } from './core/types';

// Mock traffic response for fallback
const mockTrafficResponse = (
  origin: string,
  destination: string
): TTrafficResponse => {
  console.warn(`Using mock traffics data for ${origin} to ${destination}`);

  return {
    duration: 3600, // 1 hour
    durationInTraffic: 4500, // 1 hour 15 minutes
    distance: 100000, // 100 km
  };
};

// Activities for the workflow
export const ACTIVITIES = {
  // Fetches traffic data from Mapbox API (free tier)
  async getTrafficData(config: TRouteConfig): Promise<TTrafficResponse> {
    const {
      origin: configOrigin,
      destination: configDestination,
      accessToken,
    } = config;

    try {
      const origin = await geocodeAddress(accessToken, configOrigin);
      const destination = await geocodeAddress(accessToken, configDestination);

      const response = await mapboxDirections(accessToken, origin, destination);

      METRICS.trafficApiCalls.inc({ status: 'success' });

      const route = response.routes[0];
      if (!route) {
        console.warn(`Invalid Mapbox API response`);

        return mockTrafficResponse(configOrigin, configDestination);
      }

      // Adjust duration based on distance
      const duration = route.duration;
      const distance = route.distance;

      const distanceKm = distance / 1000;
      const expectedDuration = (distanceKm / 60) * 3600;
      const durationInTraffic = Math.max(duration, expectedDuration);
      const convertedDurationInTraffic = Math.max(
        durationInTraffic,
        expectedDuration
      );

      return {
        duration,
        durationInTraffic: convertedDurationInTraffic,
        distance,
      };
    } catch (error) {
      const message =
        error instanceof AxiosError ? error.message : 'Unknown error';

      METRICS.trafficApiCalls.inc({ status: 'failed' });
      console.warn(`Traffic API error ${message}`);

      return mockTrafficResponse(configOrigin, configDestination);
    }
  },

  // Generates a delay message using OpenAI's gpt-4o-mini
  async generateDelayMessage(
    delayMinutes: number,
    openAIApiKey: string
  ): Promise<string> {
    const fallbackMessage = `Sorry your delivery is delayed by ~${delayMinutes} min. We're working to deliver`;

    try {
      if (!openAIApiKey.startsWith('sk-')) {
        throw new Error('Invalid OpenAI key');
      }

      const prompt = `Generate a professional SMS(max 170 chars) for a ${delayMinutes}-min freight delay. Include apology and delay time`;
      const response = await generateFriendlyDelayMessage(openAIApiKey, prompt);

      const message = response?.trim();
      if (!message) throw new Error('Empty OpenAI response');

      return message.length > 170 ? `${message.slice(1, 168)}...` : message;
    } catch (error) {
      console.error('OpenAI API error:', error);

      return fallbackMessage;
    }
  },

  // Sends a notification (mock implementation)
  async sendNotification(message: string) {
    METRICS.notificationAttempts.inc({ status: 'success' });
    console.log('SMS sent successfully');
    console.log(`Mock SMS: ${message}`);

    return true;
  },
} as const;
