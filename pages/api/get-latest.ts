import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  const globalStore = global as any;
  const latest = globalStore.latestLocation;

  if (!latest) return res.status(404).json({ message: 'Belum ada data lokasi' });

  res.status(200).json({
    nama: latest.nama,
    lat: latest.lat,
    lon: latest.lon,
    acc: latest.acc,
    timestamp: latest.timestamp
  });
}
