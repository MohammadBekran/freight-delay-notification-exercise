// Third-Party Imports
import axios from 'axios';

// Core Imports
import type { TMapboxResponse } from '../../types';

/**
 * Fetches traffic information using Mabox API
 *
 * @param {string} accessToken - Mapbox access token
 * @param {[number, number]} origin - Starting location
 * @param {[number, number]} destination - Ending location
 * @returns {Promise<TMapboxResponse>}  Routes informations
 * @throws {Error} If API request fails
 *
 * @example
 * const traffic = await mapboxDirections(
 *  'api-key',
 *  'Chicago, IL',
 *  'Milwaukee, WI'
 * );
 */

export const mapboxDirections = async (
  accessToken: string,
  origin: [number, number],
  destination: [number, number]
): Promise<TMapboxResponse> => {
  try {
    const coords = `${origin.join(',')};${destination.join(',')}`;

    const response = await axios.get<TMapboxResponse>(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`,
      {
        params: {
          access_token: accessToken,
          geometries: 'geojson',
          overview: 'full',
          steps: true,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Mapbox Directions Error:`, error);

    throw error;
  }
};

/**
 *
 * @param {string} accessToken  - Mapbox access token
 * @param {string} address // Address
 * @returns {Promise<[number, number]>} Geocode of given address
 * @throws {Error} If API request fails
 *
 * @example
 * const [longitude, latitude] = await geocodeAddress(
 *  'access-token',
 *  'Chicago, IL'
 * );
 */

export const geocodeAddress = async (
  accessToken: string,
  address: string
): Promise<[number, number]> => {
  try {
    const correctAddress = encodeURIComponent(address);

    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${correctAddress}.json`,
      {
        params: {
          access_token: accessToken,
          limit: 1,
        },
      }
    );

    const [longitude, latitude] = response?.data?.features?.[0]?.center;

    return [longitude, latitude] as [number, number];
  } catch (error) {
    console.error(`Error when geocode geocode of ${address}:`, error);

    throw error;
  }
};

/**
 * Generates friendly & delay-related message using OpenAI API
 *
 * @param {string} openAIApiKey - OpenAI API key
 * @param {string} prompt - Context for message generation
 * @returns {Promise<String>} Generated content
 * @throws {Error} If API request fails or response is invalid
 *
 * @example
 * const content = await generatedDelayMessage(
 *  'api-key',
 *  'Generate a friendly message for 10-minute delay'
 * );
 */
export const generateFriendlyDelayMessage = async (
  openAIApiKey: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response?.data?.choices?.[0].message?.content;
  } catch (error) {
    const errorData = JSON.stringify(
      (error as { response: { data: unknown } }).response?.data ?? error
    );
    console.error('OpenAI API error:a', errorData);

    throw error;
  }
};
