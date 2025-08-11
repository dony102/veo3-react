// Locked to Cloudflare Worker proxy — no need for API Provider UI
const BASE_URL = 'https://veo3-combined-proxy.anggimh102.workers.dev/api';

/**
 * createTask
 * Accepts either a ready payload object (preferred) or (prompt, imageUrls?) for backward compatibility.
 */
export async function createTask(payloadOrPrompt, maybeImages = []) {
  let payload;
  if (typeof payloadOrPrompt === 'string') {
    payload = { prompt: payloadOrPrompt, imageUrls: Array.isArray(maybeImages) ? maybeImages : [] };
  } else {
    payload = payloadOrPrompt || {};
  }

  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`Generate failed: ${res.status} ${text}`);
  }
  return res.json(); // { taskId }
}

export async function getStatus(taskId) {
  const url = `${BASE_URL}/status?taskId=${encodeURIComponent(taskId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`Status failed: ${res.status} ${text}`);
  }
  return res.json(); // { successFlag, ... }
}

export async function get1080p(taskId, index = 0) {
  const url = `${BASE_URL}/get1080?taskId=${encodeURIComponent(taskId)}&index=${encodeURIComponent(index)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`Get1080 failed: ${res.status} ${text}`);
  }
  return res.json(); // { resultUrl }
}

// Also export alternative names if some code uses them
export const generateVideo = createTask;
export const get1080 = get1080p;
