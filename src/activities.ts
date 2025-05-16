// Third-Party Imports
import { AxiosError } from 'axios';

// Core Imports
import type { TRouteConfig, TTrafficResponse } from './core/types';
import { METRICS } from './core/constants';
import {
  generateDelayMessage,
  googleMapsDirections,
} from './core/services/api';

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

export const ACTIVITIES = {
  // Fetches traffic data from Google Maps Directions API (free tier)
  async getTrafficData(config: TRouteConfig): Promise<TTrafficResponse> {
    const {
      origin: configOrigin,
      destination: configDestination,
      apiKey,
    } = config;

    try {
      const origin = encodeURIComponent(configOrigin);
      const destination = encodeURIComponent(configDestination);

      const response = await googleMapsDirections(apiKey, origin, destination);

      METRICS.trafficApiCalls.inc({ status: 'success' });

      const leg = response?.data?.routes?.[0]?.legs?.[0];
      if (!leg) {
        console.warn(`Invalid Google Maps API response`);

        return mockTrafficResponse(configOrigin, configDestination);
      }

      // Adjust duration based on distance
      const duration = leg.duration.value;
      const durationInTraffic = leg.duration_in_traffic?.value ?? duration;
      const distance = leg.distance.value;

      const distanceKm = distance / 100;
      const expectedDuration = (distanceKm / 60) * 3600;
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
      const response = await generateDelayMessage(openAIApiKey, prompt);

      const message = response?.choices[0].message.content?.trim();
      if (!message) throw new Error('Empty OpenAI response');

      return message.length > 170 ? `${message.slice(1, 168)}...` : message;
    } catch (error) {
      console.error('OpenAI API error:', error);

      return fallbackMessage;
    }
  },
} as const;
