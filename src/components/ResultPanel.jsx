import React from 'react'

export default function ResultPanel({ progress, result, onGet1080 }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm">{progress}</div>

      {result.url && (
        <div>
          <video className="w-full max-h-[480px] rounded-lg border border-slate-800 bg-black" controls playsInline src={result.url} />
          <div className="flex gap-2 mt-2">
            <a className="px-3 py-2 rounded-lg border border-slate-700" href={result.url} download={`veo3_${result.taskId}.mp4`}>Download</a>
            <button onClick={onGet1080} className="px-3 py-2 rounded-lg border border-slate-700">Get 1080p</button>
            <a className="px-3 py-2 rounded-lg border border-slate-700" href={result.origin} target="_blank" rel="noreferrer">Buka URL Asli</a>
          </div>
        </div>
      )}
    </div>
  )
}
