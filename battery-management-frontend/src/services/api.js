import axios from 'axios';

const API_URL = 'http://localhost:3000/api/voltage';

export const getVoltageData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching voltage data:', error);
    return [];
  }
};
