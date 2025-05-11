import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { lat, lon, acc } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!lat || !lon || !acc || !botToken || !chatId) {
      return res.status(400).json({ message: "Data tidak lengkap atau env belum diset" });
    }

    const message = `📍 Lokasi Terkini\nLatitude: ${lat}\nLongitude: ${lon}\nAkurasi: ${acc} meter`;

    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message }),
      });

      const tgData = await tgRes.json();
      console.log("Terkirim ke Telegram:", tgData);
      return res.status(200).json({ message: "Berhasil terkirim ke Telegram" });
    } catch (error) {
      console.error("Gagal kirim ke Telegram:", error);
      return res.status(500).json({ message: "Gagal kirim ke Telegram" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
