import { getApiBaseUrl } from './api-client';

export type HealthData = {
  message: string;
  status: string;
  data: {
    version: string;
    timestamp: string;
  };
};

export async function fetchHealth(): Promise<HealthData | null> {
  const apiUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${apiUrl}/api/up`, { cache: 'no-store' });
    if (!res.ok) {
      console.warn(`Failed to fetch health: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.warn('Health check failed:', error);
    return null;
  }
}
