import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'

export default function ApiKeyBar({ apiKey, setApiKey }) {
  const [reveal, setReveal] = useState(false)

  return (
    <div className="w-full bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-600">
          <KeyRound size={18} />
          <span className="text-sm">DeepSeek API Key</span>
        </div>
        <input
          type={reveal ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="ds-xxxxxxxxxxxxxxxxxxxxxxxx"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setReveal(!reveal)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
          {reveal ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}
