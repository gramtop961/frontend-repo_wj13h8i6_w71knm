import { useCallback, useState } from 'react'
import Header from './components/Header'
import ApiKeyBar from './components/ApiKeyBar'
import UploadPanel from './components/UploadPanel'
import ResultPanel from './components/ResultPanel'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = useCallback(async ({ file }) => {
    setError('')
    setResult(null)
    if (!apiKey) {
      setError('Masukkan API key DeepSeek terlebih dahulu.')
      return
    }
    try {
      setLoading(true)

      // Convert file to base64 data URL
      const base64DataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const systemPrompt = `Anda adalah analist teknikal profesional khusus market crypto/forex/stock. Tugas Anda:
- Baca chart dari gambar (candle, garis tren, indikator jika terlihat).
- Identifikasi tren utama, support/resistance kunci, pola (double top/bottom, H&S, triangle, flag), serta area supply/demand.
- Tentukan skenario utama (lanjut tren) dan alternatif (reversal) beserta probabilitas.
- Berikan rekomendasi level:
  * Entry: angka harga spesifik atau area dengan alasan singkat
  * Take Profit (TP): minimal 2 target bertingkat (TP1, TP2)
  * Stop Loss (SL): level invalidasi yang logis di luar struktur
- Kelola risiko: sarankan R:R dan ukuran posisi konservatif.
- Format keluaran JSON valid dengan struktur:
{
  "summary": "ringkasan padat 4-6 kalimat",
  "levels": { "entry": "...", "take_profit": "TP1: ..., TP2: ...", "stop_loss": "..." },
  "notes": "risiko, konfirmasi, timeframe asumsi jika tidak jelas"
}
Jika informasi pada gambar tidak cukup, jelaskan asumsi dan berikan alternatif.`

      // DeepSeek VL expects content parts with type "text" or "input_image".
      const body = {
        model: 'deepseek-vl',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analisa gambar chart berikut dan berikan output JSON sesuai skema.' },
              { type: 'input_image', image_url: base64DataUrl },
            ],
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }

      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })

      if (!resp.ok) {
        const t = await resp.text()
        throw new Error(t || 'Gagal memanggil API DeepSeek')
      }

      const data = await resp.json()
      const raw = data.choices?.[0]?.message?.content
      let parsed
      try {
        parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      } catch {
        const match = typeof raw === 'string' ? raw.match(/\{[\s\S]*\}/) : null
        if (match) parsed = JSON.parse(match[0])
      }

      if (!parsed) throw new Error('Model tidak mengembalikan JSON yang valid')
      setResult(parsed)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Terjadi kesalahan saat analisa')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <ApiKeyBar apiKey={apiKey} setApiKey={setApiKey} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Analisa Chart dari Gambar</h2>
            <p className="text-sm text-gray-600 mb-4">Unggah screenshot chart. AI akan membaca pola dan memberi rekomendasi level Entry / TP / SL.</p>
            <UploadPanel onAnalyze={analyze} loading={loading} />
            <ResultPanel result={result} error={error} />
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Contoh Prompt yang Digunakan</h3>
            <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
{`Anda adalah analist teknikal profesional khusus market crypto/forex/stock. Tugas Anda:
- Baca chart dari gambar (candle, garis tren, indikator jika terlihat).
- Identifikasi tren utama, support/resistance kunci, pola (double top/bottom, H&S, triangle, flag), serta area supply/demand.
- Tentukan skenario utama (lanjut tren) dan alternatif (reversal) beserta probabilitas.
- Berikan rekomendasi level:
  * Entry: angka harga spesifik atau area dengan alasan singkat
  * Take Profit (TP): minimal 2 target bertingkat (TP1, TP2)
  * Stop Loss (SL): level invalidasi yang logis di luar struktur
- Kelola risiko: sarankan R:R dan ukuran posisi konservatif.
- Format keluaran JSON valid dengan struktur:
{
  "summary": "ringkasan padat 4-6 kalimat",
  "levels": { "entry": "...", "take_profit": "TP1: ..., TP2: ...", "stop_loss": "..." },
  "notes": "risiko, konfirmasi, timeframe asumsi jika tidak jelas"
}
Jika informasi pada gambar tidak cukup, jelaskan asumsi dan berikan alternatif.`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
