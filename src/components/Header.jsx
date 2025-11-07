import { Rocket } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white">
            <Rocket size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Chart Insight AI</h1>
            <p className="text-xs text-gray-500">Unggah chart • Analisa otomatis • Rekomendasi Entry/TP/SL</p>
          </div>
        </div>
        <a
          href="https://www.deepseek.com/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Powered by DeepSeek
        </a>
      </div>
    </header>
  )
}
