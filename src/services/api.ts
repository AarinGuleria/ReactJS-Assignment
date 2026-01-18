import type { ApiResponse } from '../types';

const API_BASE = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number = 1): Promise<ApiResponse> => {
  const url = `${API_BASE}?page=${page}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};
