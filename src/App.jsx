import React, { useEffect, useMemo, useState } from 'react'
import SettingsPanel from './components/SettingsPanel.jsx'
import ModelSelector from './components/ModelSelector.jsx'
import PromptUploader from './components/PromptUploader.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import { createTask, getStatus, get1080p } from './lib/veoApi.js'

export default function App() {
  const [provider, setProvider] = useState('kie') // 'kie' | 'proxy'
  const [model, setModel] = useState('veo3') // 'veo3' | 'veo3-fast'
  const [settings, setSettings] = useState({ kieApiKey: '', proxyBase: '' })
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [watermark, setWatermark] = useState('')
  const [enableFallback, setEnableFallback] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState([]) // data URLs
  const [progress, setProgress] = useState('Belum ada task.')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState({ url: '', origin: '', taskId: '' })

  // Load saved settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('veo3-react-settings') || '{}')
    if (saved.provider) setProvider(saved.provider)
    if (saved.kieApiKey || saved.proxyBase) setSettings({ kieApiKey: saved.kieApiKey || '', proxyBase: saved.proxyBase || '' })
  }, [])

  const saveSettings = (s) => {
    const payload = { provider, ...s }
    localStorage.setItem('veo3-react-settings', JSON.stringify(payload))
    setSettings(s)
  }

  const onStart = async () => {
    if (!prompt.trim()) { setProgress('Prompt masih kosong'); return }
    setBusy(true)
    setResult({ url: '', origin: '', taskId: '' })
    setProgress('Mengirim task...')
    try {
      const taskId = await createTask({
        provider, model, prompt,
        aspectRatio, watermark: watermark || undefined,
        enableFallback, images,
        settings
      })
      setProgress(`Task dibuat: ${taskId}. Memantau progress...`)
      const start = Date.now()
      while (true) {
        const status = await getStatus({ provider, taskId, settings })
        if (status?.successFlag === 1 && status?.response?.resultUrls?.length) {
          const url = status.response.resultUrls[0]
          const origin = (status.response.originUrls && status.response.originUrls[0]) || url
          setResult({ url, origin, taskId })
          setProgress(`Selesai dalam ${((Date.now()-start)/1000|0)}s — taskId: ${taskId}`)
          break
        } else if (status?.successFlag === 2 || status?.successFlag === 3) {
          setProgress(`Gagal: ${status?.errorMessage || 'lihat log provider'}`)
          break
        } else {
          setProgress('Progress: generating...')
          await new Promise(r => setTimeout(r, 3000))
        }
      }
    } catch (e) {
      setProgress(`Gagal: ${e.message || e}`)
    } finally {
      setBusy(false)
    }
  }

  const onGet1080 = async () => {
    if (!result.taskId) return
    setProgress('Meminta 1080p...')
    try {
      const url = await get1080p({ provider, taskId: result.taskId, index: 0, settings })
      if (url) setResult(prev => ({ ...prev, url }))
      setProgress(url ? '1080p siap.' : '1080p belum siap. Coba lagi nanti.')
    } catch (e) {
      setProgress(`Gagal ambil 1080p: ${e.message || e}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-gradient-to-br from-blue-400 to-fuchsia-600" />
          <h1 className="text-lg font-semibold">Veo3 Web UI — React + Tailwind</h1>
        </div>
        <nav className="text-sm text-slate-400">
          <a className="hover:text-white" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-base font-semibold mb-3">1) Pengaturan</h2>
          <SettingsPanel
            provider={provider}
            setProvider={setProvider}
            settings={settings}
            onSave={saveSettings}
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-base font-semibold mb-3">2) Pilih Model</h2>
          <ModelSelector model={model} setModel={setModel}
            aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
            watermark={watermark} setWatermark={setWatermark}
            enableFallback={enableFallback} setEnableFallback={setEnableFallback}
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-base font-semibold mb-3">3) Prompt & Gambar (opsional)</h2>
          <PromptUploader
            prompt={prompt} setPrompt={setPrompt}
            images={images} setImages={setImages}
            onStart={onStart} busy={busy}
          />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-base font-semibold mb-3">4) Progress & Hasil</h2>
          <ResultPanel
            progress={progress}
            result={result}
            onGet1080={onGet1080}
          />
        </section>
      </div>

      <footer className="text-center text-xs text-slate-500 mt-6">© 2025 — Built for educational use.</footer>
    </div>
  )
}
