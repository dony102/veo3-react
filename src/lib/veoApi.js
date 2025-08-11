// src/lib/veoApi.js
const DEFAULT_BASE =
  (typeof window !== 'undefined' && window.__VEO3_DEFAULTS__?.proxyBaseUrl) ||
  'https://veo3-combined-proxy.anggimh102.workers.dev/api';

const BASE_URL = DEFAULT_BASE; // kunci ke proxy

export async function generateVideo(payload) {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Generate failed: ' + res.status);
  return res.json(); // { taskId }
}

export async function getStatus(taskId) {
  const res = await fetch(`${BASE_URL}/status?taskId=${encodeURIComponent(taskId)}`);
  if (!res.ok) throw new Error('Status failed: ' + res.status);
  return res.json(); // { successFlag, ... }
}

export async function get1080(taskId, index = 0) {
  const res = await fetch(`${BASE_URL}/get1080?taskId=${encodeURIComponent(taskId)}&index=${index}`);
  if (!res.ok) throw new Error('Get1080 failed: ' + res.status);
  return res.json(); // { resultUrl }
}
