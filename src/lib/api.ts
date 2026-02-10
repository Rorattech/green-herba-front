export type HealthData = {
  message: string;
  status: string;
  data: {
    version: string;
    timestamp: string;
  };
};

export async function fetchHealth(): Promise<HealthData | null> {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn('API URL not configured; skipping health check');
    return null;
  }
  
  try {
    const res = await fetch(`${apiUrl}/api/up`);
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
