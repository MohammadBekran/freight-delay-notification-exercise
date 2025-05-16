import axios from 'axios';

export const googleMapsDirections = async (
  key: string,
  destination: string
) => {
  try {
    const response = await axios.get(
      'maps.googleapis.comm/maps/api/directions/json',
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
    throw error;
  }
};
