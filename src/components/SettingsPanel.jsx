import React, { useMemo, useState } from 'react'

export default function SettingsPanel({ provider, setProvider, settings, onSave }) {
  const [kie, setKie] = useState(settings.kieApiKey || '')
  const [proxy, setProxy] = useState(settings.proxyBase || '')

  function save() {
    onSave({ kieApiKey: kie.trim(), proxyBase: proxy.trim() })
  }
  function reset() {
    localStorage.removeItem('veo3-react-settings')
    window.location.reload()
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-2">API Provider</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full border ${provider==='kie'?'bg-blue-600 border-blue-600 text-white':'border-slate-700 text-slate-200'}`}
            onClick={() => setProvider('kie')}
          >
            KIE.ai
          </button>
          <button
            className={`px-3 py-1.5 rounded-full border ${provider==='proxy'?'bg-blue-600 border-blue-600 text-white':'border-slate-700 text-slate-200'}`}
            onClick={() => setProvider('proxy')}
          >
            Proxy Custom
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">Gunakan <b>KIE.ai</b> langsung (client-side) atau <b>Proxy</b> jika ingin menyembunyikan API key di server Anda.</p>
      </div>

      {provider === 'kie' ? (
        <div>
          <label className="block text-sm font-medium mb-2">KIE API Key</label>
          <input
            value={kie}
            onChange={(e) => setKie(e.target.value)}
            type="password"
            placeholder="Bearer token dari KIE.ai"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
          <p className="text-xs text-slate-400 mt-1">Kunci disimpan lokal di browser Anda (localStorage).</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2">Proxy Base URL</label>
          <input
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            type="url"
            placeholder="https://your-worker.example.com"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
          <p className="text-xs text-slate-400 mt-1">Endpoint Worker/Server Anda. Lihat contoh Cloudflare Worker di folder <code>api-examples</code>.</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={save} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">Simpan</button>
        <button onClick={reset} className="border border-slate-700 text-slate-200 px-3 py-2 rounded-lg">Reset</button>
      </div>
    </div>
  )
}
