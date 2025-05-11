// pages/api/location.ts
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { lat, lon, acc } = req.body;
  
      if (!lat || !lon || !acc) {
        return res.status(400).json({ message: 'Data lokasi tidak lengkap' });
      }
  
      console.log(`Lokasi diterima - Lat: ${lat}, Lon: ${lon}, Akurasi: ${acc}`);
  
      const message = `Lokasi Terkini:\nLatitude: ${lat}\nLongitude: ${lon}\nAkurasi: ${acc} meter`;
  
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;
  
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Data terkirim ke Telegram:', data);
        res.status(200).json({ message: 'Data diterima dan dikirim ke Telegram' });
      })
      .catch(error => {
        console.error('Gagal mengirim data ke Telegram:', error);
        res.status(500).json({ message: 'Gagal mengirim data ke Telegram' });
      });
    } else {
      res.status(405).json({ message: 'Metode tidak didukung' });  // Ini hanya menerima POST
    }
  }  