// pages/api/get-latest.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { latestLocation } from './location'; // pastikan ekspor dari file location.ts

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // bisa dibatasi jika perlu

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!latestLocation) {
    return res.status(404).json({ message: 'Belum ada data lokasi.' });
  }

  res.status(200).json({
    nama: latestLocation.nama,
    lat: latestLocation.lat,
    lon: latestLocation.lon,
    acc: latestLocation.acc,
    timestamp: latestLocation.timestamp
  });
}