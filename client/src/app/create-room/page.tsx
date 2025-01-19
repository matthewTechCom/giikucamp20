"use client";

import { useMapTransactionContext } from "@/context/MapContext";
import { UserContext } from "@/context/UserContext";
import { getCsrfToken } from "@/utils/apiUtils";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;

export default function CreateRoomPage() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const { roomInfo, setRoomInfo } = useMapTransactionContext();

  const [currentStep, setCurrentStep] = useState<number>(2);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [roomPass, setRoomPass] = useState("");
  const [roomIcon, setRoomIcon] = useState<File | null>(null);

  const [clickLocation, setClickLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 35.69575,
    lng: 139.77521,
  });

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey });

  // ユーザーの現在位置を取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error);
        }
      );
    } else {
      console.error("このブラウザはGeolocationに対応していません。");
    }
  }, []);

  // ユーザー情報がない場合はダミーのユーザーをセット
  useEffect(() => {
    if (!user) {
      setUser({
        id: 1,
        username: "もち",
        userIcon: "",
      });
    }
  }, [user, setUser]);

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

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickLocation({ lat, lng });
    }
  };

  const handleSubmit = async () => {
    if (!clickLocation) {
      alert("マップ上でルームの場所を選択してください");
      return;
    }

    try {
      const csrfToken = await getCsrfToken();

      const formData = new FormData();
      formData.append("roomName", roomName);
      formData.append("password", roomPass);
      formData.append("description", roomDesc);
      formData.append("latitude", clickLocation.lat.toString());
      formData.append("longitude", clickLocation.lng.toString());

      if (roomIcon) {
        formData.append("file", roomIcon);
      } else {
        console.error("Room icon is missing!");
      }

      const response = await fetch("http://localhost:8080/registerRoom", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`エラーが発生しました: ${errorData.error}`);
        return;
      }

      const result = await response.json();
      alert("部屋が登録されました！");
      router.push(
        `/chat?room=${encodeURIComponent(roomName.trim())}&password=${encodeURIComponent(roomPass.trim())}`
      );
    } catch (error) {
      console.error("リクエストエラー:", error);
      alert("リクエストの送信中にエラーが発生しました。");
    }
  };

  return currentStep === 2 ? (
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
            placeholder="ルーム名"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full p-2 text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">ルームアイコン</label>
          <input
            type="file"
            className="border-2 border-dashed border-gray-300 rounded p-4 bg-gray-100 w-full"
            accept="image/*"
            onChange={(e) => setRoomIcon(e.target.files ? e.target.files[0] : null)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold">ルームの説明</label>
          <input
            type="text"
            placeholder="ルームの説明"
            value={roomDesc}
            onChange={(e) => setRoomDesc(e.target.value)}
            className="w-full p-2 text-black"
          />
        </div>
        <div className="mb-10">
          <label className="block mb-1 font-bold">ルームパスワード</label>
          <input
            type="password"
            placeholder="ルームパスワード"
            value={roomPass}
            onChange={(e) => setRoomPass(e.target.value)}
            className="w-full p-2 text-black"
            required
          />
        </div>
        <div className="flex justify-center gap-5">
          <button
            className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
            onClick={() => setCurrentStep(3)}
            disabled={!roomName || !roomPass}
          >
            つづける →
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0 z-0 min-h-screen">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={17}
          onClick={handleMapClick}
        >
          {/* ユーザーがクリックして選択した座標があればその位置にマーカーを表示。
              なければ現在位置にもマーカーを表示する例 */}
          {clickLocation ? (
            <Marker position={clickLocation} />
          ) : (
            <Marker position={center} />
          )}
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
      <footer className="absolute bottom-0 w-full z-10 p-4 flex justify-center shadow-lg">
        <button
          className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
          onClick={handleSubmit}
        >
          この場所でルームを作成する →
        </button>
      </footer>
    </div>
  );
}
