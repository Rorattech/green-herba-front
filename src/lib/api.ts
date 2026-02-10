export type HealthData = {
  message: string;
  status: string;
  data: {
    version: string;
    timestamp: string;
  };
};

export async function fetchHealth(): Promise<HealthData> {
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('API URL not configured');
  const res = await fetch(`${apiUrl}/api/up`);
  if (!res.ok) throw new Error(`Failed to fetch health: ${res.status}`);
  return res.json();
}
