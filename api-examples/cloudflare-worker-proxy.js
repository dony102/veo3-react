export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const base = 'https://api.kie.ai';
    const token = env.KIE_API_KEY; // set via wrangler secret

    if (url.pathname === '/generate' && request.method === 'POST') {
      const body = await request.json();
      const payload = {
        prompt: body.prompt,
        imageUrls: [],
        model: body.model === 'veo3-fast' ? 'veo3-fast' : 'veo3',
        aspectRatio: body.aspectRatio || '16:9',
        watermark: body.watermark || undefined,
        enableFallback: !!body.enableFallback,
      };
      const res = await fetch(`${base}/api/v1/veo/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ taskId: data?.data?.taskId }), { headers: { 'content-type': 'application/json' } });
    }

    if (url.pathname === '/status' && request.method === 'GET') {
      const taskId = url.searchParams.get('taskId');
      const res = await fetch(`${base}/api/v1/veo/record-info?taskId=${encodeURIComponent(taskId)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return new Response(JSON.stringify(data?.data || {}), { headers: { 'content-type': 'application/json' } });
    }

    if (url.pathname === '/get1080' && request.method === 'GET') {
      const taskId = url.searchParams.get('taskId');
      const index = url.searchParams.get('index') || '0';
      const res = await fetch(`${base}/api/v1/veo/get-1080p-video?taskId=${encodeURIComponent(taskId)}&index=${encodeURIComponent(index)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return new Response(JSON.stringify({ resultUrl: data?.data?.resultUrl }), { headers: { 'content-type': 'application/json' } });
    }

    return new Response('OK', { status: 200 });
  }
}
