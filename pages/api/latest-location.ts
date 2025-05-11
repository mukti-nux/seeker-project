// pages/api/latest-location.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { latestLocation } from './location';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!latestLocation) {
    return res.status(404).json({ message: 'Belum ada lokasi' });
  }

  res.status(200).json({
    lat: latestLocation.lat,
    lon: latestLocation.lon,
    nama: latestLocation.nama,
    acc: latestLocation.acc,
    time: latestLocation.timestamp,
  });
}
