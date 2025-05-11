import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { lat, lon, acc, nama } = req.body;
    console.log("Data diterima:", { lat, lon, acc, nama });
    // Simpan ke memori atau database di sini
    res.status(200).json({ message: "Data diterima" });
  } else if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
