"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { GoogleMap, Marker, useLoadScript, OverlayView } from "@react-google-maps/api";
import { useMapTransactionContext } from "@/context/MapContext";
import { RoomDetail } from "@/components/map/RoomDetail";
import Image from "next/image";


const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;

// サーバーからのレスポンス型定義
interface RoomApiResponse {
  id: number;
  roomName: string;
  roomImage: string;
  password: string;
  description: string;
  latitude: string;  // サーバーからは文字列で返されると仮定
  longitude: string;
}

// コンポーネント内で使用するルーム情報型定義
interface RoomInfoState {
  id: number;
  roomName: string;
  roomImage: string;
  password: string;
  description: string;
  roomLatitude: number;
  roomLongitude: number;
}

let defaulData = {
  id: 0,
  roomName: "",
  roomImage: "",
  password: "",
  description: "",
  roomLatitude: 0,
  roomLongitude: 0,
}

export default function SearchRoomPage() {
  const [rooms, setRooms] = useState<RoomInfoState[]>([]);
  const [nowRoom, setNowRoom] = useState<RoomInfoState>(defaulData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { isRoomDetailModal ,setIsRoomDetailModal, pushToRoomTriger, setPushToRoomTriger } = useMapTransactionContext();

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey });

  // 地図の中心位置をユーザーの現在位置に設定
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 35.69575, // 初期値として秋葉原付近
    lng: 139.77521,
  });

  // ユーザーの現在位置を取得して中心を更新
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

  // 部屋リストをサーバーから取得
  useEffect(() => {
    async function loadRooms() {
      setIsRoomDetailModal(false)
      try {
        const res = await fetch("http://localhost:8080/rooms");
        console.log("Fetch /rooms response:", res);

        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await res.json();
        console.log("Raw data from server:", data);

        // 型アサーションを利用して、dataをRoomApiResponseの配列とみなす
        const roomsData = data as RoomApiResponse[];

        // サーバーからの latitude / longitude を数値に変換して roomLatitude / roomLongitude にする
        const numericData: RoomInfoState[] = roomsData.map((room) => {
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
            id: room.id,
            roomName: room.roomName,
            roomImage: room.roomImage,
            password: room.password,
            description: room.description,
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

  // rooms 更新時にログを出力
  useEffect(() => {
    console.log("rooms state updated:", rooms);
  }, [rooms]);

  // ユーザーがログインしていなければメッセージを表示
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        ログインしてください。
      </div>
    );
  }

  // 地図の読み込みエラー
  if (loadError) {
    return <div>地図を読み込めませんでした。</div>;
  }

  // 地図がロード中
  if (!isLoaded) {
    return <div>地図を読み込んでいます...</div>;
  }

  // データの読み込み中またはエラー表示
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // 丸いアイコンの大きさ
  const circleSize = 30;

  return (
    <div className="relative w-screen h-screen">
      {/* 地図（最背面） */}
      {isRoomDetailModal && <RoomDetail nowRoom={nowRoom}/>}
      <div className="absolute inset-0 z-0 min-h-screen">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={17}
        >
          {/* Render Markers */}
          {rooms.map((roomInfo, index) => (
            <React.Fragment key={`room-${roomInfo.id}`}>
            <Marker
              key={index}
              position={{
                lat: roomInfo.roomLatitude,
                lng: roomInfo.roomLongitude,
              }}
              icon={{
                url: roomInfo.roomImage,
                scaledSize: new google.maps.Size(35, 35),
              }}
              onClick={() => {
               setIsRoomDetailModal(true)
               setNowRoom(roomInfo);
              }
            }
            />
            
            {/* ピンの上部に丸い画像を重ねる OverlayView */}
            <OverlayView
                position={{
                  lat: roomInfo.roomLatitude,
                  lng: roomInfo.roomLongitude,
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                getPixelPositionOffset={() => ({
                  x: -(circleSize / 2), // 円の中心をピンの中心に合わせる
                  y: -(circleSize + 10), // 円の高さ分上にずらす
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
                  zIndex: 9999,
                }}
              >
                <Image
                  src={roomInfo.roomImage}
                  alt={`${roomInfo.roomName} icon`}
                  width={circleSize}
                  height={circleSize}
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

      {/* メインコンテンツ */}
      <main className="relative z-10 flex-1 pointer-events-none" />

      {/* フッター */}
      <footer className="pointer-events-none absolute bottom-0 w-full z-10">
        <div className="p-4 flex justify-center shadow-lg">
          <button
            className="pointer-events-auto bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
            onClick={() => router.push("/chat")}
          >
            参加したいピンをクリックしてください
          </button>
        </div>
      </footer>
    </div>
  );
}
