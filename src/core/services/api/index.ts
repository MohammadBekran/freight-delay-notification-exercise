// Third-Party Imports
import axios from 'axios';
import OpenAI from 'openai';
import twilio from 'twilio';

// Google Maps Directions API call handler
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

// API Handler for generating friendly & delay-related message for the customer using OpenAI's gpt-4o-mini
export const generateDelayMessage = async (
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

// Twilio send SMS API handler
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
