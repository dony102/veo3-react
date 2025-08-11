import React, { useRef } from 'react'

export default function PromptUploader({ prompt, setPrompt, images, setImages, onStart, busy }) {
  const fileRef = useRef(null)

  function handleFiles(files) {
    const arr = Array.from(files).slice(0, 3)
    arr.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => setImages(prev => [...prev, reader.result])
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-2">Prompt</label>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e)=>setPrompt(e.target.value)}
          placeholder="Deskripsikan adegan videonya..."
          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Upload Gambar (opsional, 16:9 direkomendasikan)</label>
        <div
          onClick={()=>fileRef.current?.click()}
          onDragOver={(e)=>{e.preventDefault()}}
          onDrop={(e)=>{e.preventDefault(); handleFiles(e.dataTransfer.files)}}
          className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-slate-400 cursor-pointer hover:bg-slate-900/50"
        >
          Tarik & lepas gambar atau klik untuk pilih
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e)=>handleFiles(e.target.files)} multiple />
        </div>
        {images.length>0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {images.map((src, i)=>(
              <img key={i} src={src} className="w-36 h-20 object-cover rounded-lg border border-slate-700" />
            ))}
          </div>
        )}
      </div>

      <button disabled={busy} onClick={onStart} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg">
        {busy ? 'Memulai...' : 'START'}
      </button>
    </div>
  )
}
