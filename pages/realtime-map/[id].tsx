// pages/realtime-map/[id].tsx
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

// Tambahkan deklarasi supaya TypeScript tahu properti ini ada
declare global {
  interface Window {
    initMapWithId?: (id: string) => void;
  }
}

export default function RealtimeMap() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    
    // Cek terus setiap 200ms sampai fungsi initMapWithId tersedia
    const interval = setInterval(() => {
      if (typeof window.initMapWithId === 'function') {
        console.log("initMapWithId siap, menjalankan dengan id:", id);
        window.initMapWithId(id);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [id, router.isReady]);

  return (
    <>
      <Head>
        <title>Live Tracking - {id}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        />
        <style>{`
          html, body { margin: 0; padding: 0; height: 100%; }
          #map { width: 100%; height: 100vh; }
        `}</style>
      </Head>

      <div id="map">Memuat peta...</div>

      {/* Leaflet core */}
      <Script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" />

      {/* Firebase + real-time map logic */}
      <Script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "seeker-projectku.firebaseapp.com",
  databaseURL: "https://seeker-projectku-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "seeker-projectku",
  storageBucket: "seeker-projectku.appspot.com",
  messagingSenderId: "ISI_SENDER_ID",
  appId: "ISI_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let map, marker;

// Definisikan fungsi initMapWithId untuk mendapatkan data tracking dari Firebase
window.initMapWithId = function(id) {
  console.log("Memulai initMapWithId dengan id:", id);
  if (!map) {
    map = L.map("map").setView([-7.5, 110.4], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }

  const lokasiRef = ref(db, 'tracking/' + id);
  onValue(lokasiRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Data Firebase:", data);
    if (!data) return;
    const { lat, lon, acc, device, timestamp } = data;
    
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(\`
      <b>\${device || 'Unknown Device'}</b><br>
      Time: \${timestamp}<br>
      Accuracy: \${acc} m
    \`).openPopup();
    map.setView([lat, lon], 16);
  });
};
          `,
        }}
      />
    </>
  );
}
