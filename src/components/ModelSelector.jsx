import React from 'react'

export default function ModelSelector({ model, setModel, aspectRatio, setAspectRatio, watermark, setWatermark, enableFallback, setEnableFallback }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full border ${model==='veo3'?'bg-blue-600 border-blue-600 text-white':'border-slate-700 text-slate-200'}`}
          onClick={() => setModel('veo3')}
        >
          Veo 3 (Quality)
        </button>
        <button
          className={`px-3 py-1.5 rounded-full border ${model==='veo3-fast'?'bg-blue-600 border-blue-600 text-white':'border-slate-700 text-slate-200'}`}
          onClick={() => setModel('veo3-fast')}
        >
          Veo 3 Fast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          >
            <option value="16:9">16:9 (native)</option>
            <option value="9:16">9:16 (vertical, auto reframe)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Watermark (opsional)</label>
          <input
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
            placeholder="cth: MyBrand"
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={enableFallback} onChange={(e)=>setEnableFallback(e.target.checked)} />
        Enable Fallback (kurangi false positive)
      </label>
    </div>
  )
}
