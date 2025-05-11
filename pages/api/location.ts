import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { lat, lon, acc } = req.body

  console.log(`Lokasi diterima: lat=${lat}, lon=${lon}, akurasi=${acc}m`)

  // Bisa dikembangkan untuk log ke database / Telegram / dsb

  return res.status(200).json({ status: 'OK', received: { lat, lon, acc } })
}
