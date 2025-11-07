import { CheckCircle2, TriangleAlert, Target, TrendingUp } from 'lucide-react'

export default function ResultPanel({ result, error }) {
  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-center gap-2">
          <TriangleAlert size={18} />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="mt-6 grid gap-4">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Ringkasan Analisa</h3>
          <TrendingUp className="text-blue-600" size={18} />
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.summary}</p>
      </div>

      <div className="rounded-xl border bg-white p-5 grid gap-3">
        <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm">
          <Target size={18} /> Rekomendasi Level
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <LevelCard label="Entry" value={result.levels?.entry} tone="blue" />
          <LevelCard label="Take Profit" value={result.levels?.take_profit} tone="green" />
          <LevelCard label="Stop Loss" value={result.levels?.stop_loss} tone="red" />
        </div>
      </div>

      {result.notes && (
        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm mb-2">
            <CheckCircle2 size={18} /> Catatan Risiko & Skenario
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.notes}</p>
        </div>
      )}
    </div>
  )
}

function LevelCard({ label, value, tone }) {
  const toneMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <div className={`rounded-lg border p-4 ${toneMap[tone]}`}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-lg font-semibold">{value ?? '-'}</p>
    </div>
  )
}
