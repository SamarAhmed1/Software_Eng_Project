// src/api/openaiProxy.ts
import axios from 'axios';

interface ApiResponse {
  result: string;
}

const BACKEND_URL = 'http://192.168.56.1:3000/analyze-image';

export const analyzeImage = async (base64Image: string): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(BACKEND_URL, {
      imageBase64: base64Image,
    });
    return response.data.result;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to analyze image');
  }
};