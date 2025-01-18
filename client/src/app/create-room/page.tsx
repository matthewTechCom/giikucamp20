"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;

export default function CreateRoomPage() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  // ステップ管理: 2(情報入力) or 3(地図選択)
  const [currentStep, setCurrentStep] = useState<number>(2);

  // ルーム情報
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [roomPass, setRoomPass] = useState("");

  // 地図関連
  const [clickLocation, setClickLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey });

  // 地図の中心
  const center = { lat: 35.69575, lng: 139.77521 };

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

  // 地図クリック
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickLocation({ lat, lng });
      alert(`クリックした場所: (${lat}, ${lng})`);
    }
  };

  // ルーム作成確定
  const handleSubmit = () => {
    if (!clickLocation) {
      alert("マップ上でルームの場所を選択してください");
      return;
    }
    // 実際にはサーバーへルーム情報をPOSTなど
    console.log({
      roomName,
      roomDesc,
      roomPass,
      clickLocation,
    });
    alert("ルームを作成しました！");
    router.push("/home");
  };

  // Step2画面: ルーム情報入力
  if (currentStep === 2) {
    return (
      <div className="flex flex-col justify-center min-h-screen bg-black text-slate-100 bg-opacity-80">
        <div className="fixed inset-0 h-screen -z-10">
          <Image
            alt="background"
            src="/images/background.png"
            quality={100}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex w-full justify-between px-4 mb-4">
          <h2 className="text-2xl font-bold">ルームを作成する</h2>
          <button
            className="bg-yellow-300 text-black font-semibold px-4 py-2 rounded-lg"
            onClick={() => router.push("/home")}
          >
            戻る
          </button>
        </div>
        <div className="mx-4 bg-white bg-opacity-20 rounded-2xl p-10 backdrop-blur-sm shadow-lg border-white border-opacity-20 border">
          <div className="mb-4">
            <label className="block mb-1 font-bold">ルーム名</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-bold">ルームアイコン</label>
            <input
              type="file"
              className="w-full p-4 text-slate-100 bg-black bg-opacity-50"
              accept="image/*"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-bold">ルームの説明</label>
            <input
              type="text"
              value={roomDesc}
              onChange={(e) => setRoomDesc(e.target.value)}
              className="w-full p-2 text-black"
            />
          </div>
          <div className="mb-10">
            <label className="block mb-1 font-bold">ルームパスワード</label>
            <input
              type="password"
              value={roomPass}
              onChange={(e) => setRoomPass(e.target.value)}
              className="w-full p-2 text-black"
            />
          </div>
          <div className="flex justify-center gap-5">
            <button
              className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
              onClick={() => setCurrentStep(3)}
            >
              つづける →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step3画面: マップで場所選択
  if (currentStep === 3) {
    return (
      <div className="relative w-screen h-screen">
        {/* --- 地図（最背面） --- */}
        <div className="absolute inset-0 z-0 min-h-screen">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={17}
            onClick={handleMapClick}
          >
            {clickLocation && <Marker position={clickLocation} />}
          </GoogleMap>
        </div>

        <header className="relative z-10 bg-black bg-opacity-80 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">ルームを作成する</h2>
          <button
            className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
            onClick={() => setCurrentStep(2)}
          >
            戻る
          </button>
        </header>

        <main className="relative z-10 flex-1 pointer-events-none" />

        <footer className="pointer-events-none absolute bottom-0 w-full z-10">
          <div className="p-4 flex justify-center shadow-lg">
            <button
              className="pointer-events-auto bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
              onClick={handleSubmit}
            >
              この場所でルームを作成する →
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // それ以外はとりあえずステップ2に戻す
  return null;
}
