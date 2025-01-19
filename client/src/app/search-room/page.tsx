"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  OverlayView,
} from "@react-google-maps/api";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;

interface RoomInfoState {
  id: number;
  roomName: string;
  roomImage: string;
  password: string;
  description: string;
  roomLatitude: number;
  roomLongitude: number;
}

export default function SearchRoomPage() {
  const [rooms, setRooms] = useState<RoomInfoState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useContext(UserContext);

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey });

  // 部屋リストを取得
  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await fetch("http://localhost:8080/rooms");
        console.log("Fetch /rooms response:", res);

        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await res.json();
        console.log("Raw data from server:", data);

        // APIからのlatitude/longitude文字列を数値型へ変換
        const numericData = data.map((room: any) => {
          const lat = parseFloat(room.latitude);
          const lng = parseFloat(room.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.error("Invalid lat/lng encountered:", {
              latitude: room.latitude,
              longitude: room.longitude,
              room,
            });
          }

          return {
            ...room,
            roomLatitude: lat,
            roomLongitude: lng,
          };
        });

        setRooms(numericData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    loadRooms();
  }, []);

  // rooms 更新時にログを出す
  useEffect(() => {
    console.log("rooms state updated:", rooms);
  }, [rooms]);

  // 地図の中心座標（例：秋葉原付近）
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // 丸いアイコンの大きさ
  const circleSize = 30;

  return (
    <div className="relative w-screen h-screen">
      {/* 地図（最背面） */}
      <div className="absolute inset-0 z-0 min-h-screen">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={17}
        >
          {rooms.map((roomInfo) => (
            <React.Fragment key={`room-${roomInfo.id}`}>
              {/* デフォルトのピン（Marker） */}
              <Marker
                position={{
                  lat: roomInfo.roomLatitude,
                  lng: roomInfo.roomLongitude,
                }}
                onClick={() =>
                  router.push(
                    `/chat?room=${encodeURIComponent(
                      roomInfo.roomName.trim()
                    )}&password=${encodeURIComponent(roomInfo.password.trim())}`
                  )
                }
              />

              {/* ピンの上部に丸い画像を重ねる OverlayView */}
              <OverlayView
                position={{
                  lat: roomInfo.roomLatitude,
                  lng: roomInfo.roomLongitude,
                }}
                // Markerと同じ座標に配置しつつ、上にずらす
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={() => ({
                  // xは円の中心をピンの中心に合わせる
                  x: -(circleSize / 2),
                  // yは丸いアイコンの高さ分 + 余裕(20px)で上へ
                  y: -(circleSize + 10),
                })}
              >
                <div
                  onClick={() =>
                    router.push(
                      `/chat?room=${encodeURIComponent(
                        roomInfo.roomName.trim()
                      )}&password=${encodeURIComponent(
                        roomInfo.password.trim()
                      )}`
                    )
                  }
                  style={{
                    width: circleSize,
                    height: circleSize,
                    borderRadius: "50%",
                    overflow: "hidden",
                    cursor: "pointer",
                    // 枠線が必要な場合:
                    // border: "2px solid white",
                    zIndex: 9999,
                  }}
                >
                  <img
                    src={roomInfo.roomImage}
                    alt="room icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </OverlayView>
            </React.Fragment>
          ))}
        </GoogleMap>
      </div>

      {/* ヘッダー */}
      <header className="relative z-10 bg-black bg-opacity-80 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">ルームを検索する</h2>
        <button
          className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
          onClick={() => router.push("/home")}
        >
          戻る
        </button>
      </header>

      {/* メイン（クリック操作を地図に通したい場合はpointer-events-none） */}
      <main className="relative z-10 flex-1 pointer-events-none" />

      {/* フッター */}
      <footer className="pointer-events-none absolute bottom-0 w-full z-10">
        <div className="p-4 flex justify-center shadow-lg">
          <button
            className="pointer-events-auto bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
            onClick={() => router.push("/chat")}
          >
            このルームに参加する →
          </button>
        </div>
      </footer>
    </div>
  );
}
