// Third-Party Imports
import axios from 'axios';
import OpenAI from 'openai';
import twilio from 'twilio';

/**
 * Fetches real-time traffic information using Google Maps Directions API
 *
 * @param {string} key - Google Maps API key
 * @param {string} origin - Starting location
 * @param {string} destination - Ending location
 * @returns {Promise<TTrafficResponse>}  Duration and distance information
 * @throws {Error} if API request fails or response is invalid
 *
 * @example
 * const traffic = await googleMapsDirections(
 *  'api-key',
 *  'Chicago, IL',
 *  'Milwaukee, WI'
 * );
 */

export const googleMapsDirections = async (
  key: string,
  origin: string,
  destination: string
) => {
  try {
    const response = await axios.get(
      'maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          key,
          origin,
          destination,
          departure_time: 'now',
          traffic_model: 'best_guess',
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Google Maps Directions Error:`, error);

    throw error;
  }
};

/**
 * Generates friendly & delay-related message using OpenAI API
 *
 * @param {string} openAIApiKey - OpenAI API key
 * @param {string} prompt - Context for message generation
 * @returns {Promise<OpenAI.Chat.Completions.ChatCompletion>} Generated content
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
): Promise<OpenAI.Chat.Completions.ChatCompletion> => {
  try {
    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 50,
      temperature: 0.8,
    });

    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);

    throw error;
  }
};

/**
 * Sends SMS notification to the customer using Twilio API
 *
 * @param twilioSid {string}  - Twilio account SID
 * @param twilioAuthToken {string} - Twilio auth token
 * @param twilioPhoneNumber {string} - Sender phone number
 * @param phoneNumber {string} - Recipient phone number
 * @param message {string} - Message content
 * @returns {Promise<void>}
 * @throws {Error} If message sending fails
 *
 * @example
 * await sendNotificationToCustomer(
 *  'sid',
 *  'auth-token',
 *  '+98765432123',
 *  '+12345678909',
 *  'Your delivery is delayed'
 * );
 */
export const sendNotificationToCustomer = async (
  twilioSid: string,
  twilioAuthToken: string,
  twilioPhoneNumber: string,
  phoneNumber: string,
  message: string
): Promise<void> => {
  try {
    const client = twilio(twilioSid, twilioAuthToken);
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
  } catch (error) {
    console.error('Twilio API error:', error);
  }
};
