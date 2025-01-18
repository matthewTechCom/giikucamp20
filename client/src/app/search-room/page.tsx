"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;

export default function SearchRoomPage() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey });

  // 地図の中心
  const center = { lat: 35.69575, lng: 139.77521 };

  // 例: 秋葉原の座標
  const positionAkiba = { lat: 35.69732, lng: 139.7657 };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        ログインしてください。
      </div>
    );
  }

  if (loadError) {
    return <div>地図を読み込めませんでした。</div>;
  }

  if (!isLoaded) {
    return <div>地図を読み込んでいます...</div>;
  }

  const handleClickAkiba = () => {
    // 例えば ルーム詳細ページ や チャット画面へ遷移する例
    alert("秋葉原のルームに参加します！");
    // router.push("/room/xxxx");
  };

  return (
    <div className="relative w-screen h-screen">
      {/* --- 地図（最背面） --- */}
      <div className="absolute inset-0 z-0 min-h-screen">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={17}
        >
          <Marker position={positionAkiba} />
        </GoogleMap>
      </div>

      <header className="relative z-10 bg-black bg-opacity-80 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">ルームを検索する</h2>
        <button
          className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
          onClick={() => router.push("/home")}
        >
          戻る
        </button>
      </header>

      <main className="relative z-10 flex-1 pointer-events-none" />

      <footer className="pointer-events-none absolute bottom-0 w-full z-10">
        <div className="p-4 flex justify-center shadow-lg">
          <button
            className="pointer-events-auto bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
            onClick={handleClickAkiba}
          >
            このルームに参加する →
          </button>
        </div>
      </footer>
    </div>
  );
}
