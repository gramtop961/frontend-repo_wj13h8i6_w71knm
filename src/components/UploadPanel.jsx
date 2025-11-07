import { useRef, useState } from 'react'
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react'

export default function UploadPanel({ onAnalyze, loading }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const submit = () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    onAnalyze({ file, preview })
  }

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault() }}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white/70 backdrop-blur hover:border-blue-400 transition-colors"
      >
        <div className="flex items-center gap-4">
          {preview ? (
            <img src={preview} alt="preview" className="h-28 w-28 object-cover rounded-lg border" />
          ) : (
            <div className="h-28 w-28 grid place-items-center rounded-lg bg-gray-50 border">
              <ImageIcon className="text-gray-400" />
            </div>
          )}

        <div className="flex-1">
          <p className="text-sm text-gray-700 font-medium">Unggah gambar chart (PNG/JPG)</p>
          <p className="text-xs text-gray-500">Tarik & letakkan atau pilih file. Sistem akan menganalisa pola, level kunci, dan memberi Entry/TP/SL.</p>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UploadCloud size={16} /> Pilih Gambar
            </button>
            <button
              onClick={submit}
              disabled={loading || !preview}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
              {loading ? 'Menganalisa…' : 'Analisa Chart'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
