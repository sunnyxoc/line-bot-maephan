import { Redis } from '@upstash/redis';

let client: Redis | null = null;
let clientCreated = false;

function getClient(): Redis | null {
  if (clientCreated) return client;
  clientCreated = true;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.error('[mute] error: KV_REST_API_URL / KV_REST_API_TOKEN is not set');
    return null;
  }

  client = new Redis({ url, token });
  return client;
}

function muteKey(userId: string): string {
  return `mute:${userId}`;
}

export async function isMuted(userId: string): Promise<boolean> {
  const redis = getClient();
  if (!redis) return false;

  try {
    const value = await redis.get(muteKey(userId));
    return value !== null;
  } catch (err) {
    console.error('[mute] error', err instanceof Error ? err.message : err);
    return false;
  }
}

export async function mute(userId: string, minutes: number): Promise<void> {
  const redis = getClient();
  if (!redis) return;

  try {
    await redis.set(muteKey(userId), '1', { ex: minutes * 60 });
  } catch (err) {
    console.error('[mute] error', err instanceof Error ? err.message : err);
  }
}

export async function unmute(userId: string): Promise<void> {
  const redis = getClient();
  if (!redis) return;

  try {
    await redis.del(muteKey(userId));
  } catch (err) {
    console.error('[mute] error', err instanceof Error ? err.message : err);
  }
}
