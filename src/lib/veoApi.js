// Thin API client for KIE.ai or proxy
export async function createTask({ provider, model, prompt, aspectRatio, watermark, enableFallback, images, settings }) {
  const imageUrls = []
  if (provider === 'kie') {
    const token = (settings.kieApiKey || '').trim()
    if (!token) throw new Error('Masukkan KIE API Key di Pengaturan.')
    const body = { prompt, imageUrls, model, aspectRatio, watermark, enableFallback }
    const res = await fetch('https://api.kie.ai/api/v1/veo/generate', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data?.data?.taskId) return data.data.taskId
    throw new Error('Tidak ada taskId dalam respons.')
  } else {
    const base = (settings.proxyBase || '').trim()
    if (!base) throw new Error('Isi Proxy Base URL pada mode Proxy.')
    const res = await fetch(new URL('/generate', base).toString(), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio, watermark, enableFallback, model, images })
    })
    if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`)
    const data = await res.json()
    if (data?.taskId) return data.taskId
    throw new Error('Proxy: tidak ada taskId')
  }
}

export async function getStatus({ provider, taskId, settings }) {
  if (provider === 'kie') {
    const token = (settings.kieApiKey || '').trim()
    if (!token) throw new Error('Masukkan KIE API Key di Pengaturan.')
    const u = new URL('https://api.kie.ai/api/v1/veo/record-info')
    u.searchParams.set('taskId', taskId)
    const res = await fetch(u, { headers: { 'Authorization': `Bearer ${token}` } })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data || null
  } else {
    const base = (settings.proxyBase || '').trim()
    const u = new URL('/status', base)
    u.searchParams.set('taskId', taskId)
    const res = await fetch(u.toString())
    if (!res.ok) return null
    return await res.json()
  }
}

export async function get1080p({ provider, taskId, index=0, settings }) {
  if (provider === 'kie') {
    const token = (settings.kieApiKey || '').trim()
    const u = new URL('https://api.kie.ai/api/v1/veo/get-1080p-video')
    u.searchParams.set('taskId', taskId)
    u.searchParams.set('index', String(index))
    const res = await fetch(u, { headers: { 'Authorization': `Bearer ${token}` } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data?.data?.resultUrl || ''
  } else {
    const base = (settings.proxyBase || '').trim()
    const u = new URL('/get1080', base)
    u.searchParams.set('taskId', taskId)
    u.searchParams.set('index', String(index))
    const res = await fetch(u.toString())
    if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`)
    const data = await res.json()
    return data?.resultUrl || ''
  }
}
