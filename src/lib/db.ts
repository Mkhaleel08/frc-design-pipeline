import { Redis } from '@upstash/redis';
import { DesignRequest } from './types';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const REQUESTS_KEY = 'frc:requests';

export async function getAllRequests(): Promise<DesignRequest[]> {
  const data = await redis.get<DesignRequest[]>(REQUESTS_KEY);
  return data || [];
}

export async function getRequestById(id: string): Promise<DesignRequest | null> {
  const requests = await getAllRequests();
  return requests.find(r => r.id === id) || null;
}

export async function createRequest(request: DesignRequest): Promise<DesignRequest> {
  const requests = await getAllRequests();
  requests.push(request);
  await redis.set(REQUESTS_KEY, requests);
  return request;
}

export async function updateRequest(id: string, updates: Partial<DesignRequest>): Promise<DesignRequest | null> {
  const requests = await getAllRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return null;

  requests[index] = { ...requests[index], ...updates, updatedAt: new Date().toISOString() };
  await redis.set(REQUESTS_KEY, requests);
  return requests[index];
}

export async function deleteRequest(id: string): Promise<boolean> {
  const requests = await getAllRequests();
  const filtered = requests.filter(r => r.id !== id);
  if (filtered.length === requests.length) return false;
  await redis.set(REQUESTS_KEY, filtered);
  return true;
}

export async function advanceRequestStage(id: string): Promise<DesignRequest | null> {
  const stages = ['Submitted', 'Assigned', 'In Progress', 'Review', 'Fabrication', 'Complete'];
  const request = await getRequestById(id);
  if (!request) return null;

  const currentIndex = stages.indexOf(request.stage);
  if (currentIndex === -1 || currentIndex === stages.length - 1) return null;

  const newStage = stages[currentIndex + 1] as DesignRequest['stage'];
  return updateRequest(id, { stage: newStage });
}
