"use client";
import { FirstView } from "@/components/map/FirstView";
import { useMapTransactionContext } from "@/context/MapContext";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { fetchUser } from "../../utils/apiUtils";
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;
const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const { isFirstViewModal, setIsFirstViewModal } = useMapTransactionContext();
  const [clickLocation, setClickLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({
    width: "400px",
    height: "800px",
  });
  const router = useRouter();
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickLocation({ lat, lng });
      alert(`クリックした場所は緯度が${lat}、経度が${lng}です`);
    }
  };
  useEffect(() => {
    // ユーザー情報の初期化
    const loadUser = async () => {
      if (!user) {
        try {
          const userData = await fetchUser(); // `/me` エンドポイントでユーザー情報を取得
          setUser(userData);
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました", error);
        }
      }
    };
    loadUser();
    const updateContainerStyle = () => {
      const width = window.innerWidth;
      setContainerStyle({
        width: "400px",
        height: width <= 450 ? "500px" : "800px",
      });
    };
    updateContainerStyle();
    window.addEventListener("resize", updateContainerStyle);
    return () => window.removeEventListener("resize", updateContainerStyle);
  }, [user, setUser]);
  const center = {
    lat: 35.69575,
    lng: 139.77521,
  };
  const positionAkiba = {
    lat: 35.69732,
    lng: 139.7657,
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
  });
  const handleChangeURL = () => {
    router.push("https://www.google.co.jp");
  };
  if (loadError) return <div>地図を読み込めませんでした。</div>;
  if (!isLoaded) return <div>地図を読み込んでいます...</div>;
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        ログインしてください。
      </div>
    );
  }
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="rounded shadow-md w-96">
        {isFirstViewModal && <FirstView />}
        <div className="flex p-4 bg-black bg-opacity-80 text-slate-100 justify-between">
          <h1 className="text-2xl font-bold">MapChat</h1>
          <Image
            src={user.userIcon?.trim() ? user.userIcon : "/default-icon.png"}
            alt="ユーザーアイコン"
            width={36}
            height={36}
            className="rounded-full"
          />
        </div>
        <div className="flex items-center justify-center">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={17}
            onClick={handleMapClick}
          >
            <Marker
              position={positionAkiba}
              label={"秋葉原"}
              icon={{
                url: "https://lamp-ramp.com/wp-content/uploads/2023/08/keii01-1024x1024.png",
                scaledSize: new google.maps.Size(50, 50),
              }}
              onClick={handleChangeURL}
            />
            <Marker position={center} label={"テスト1"} />
          </GoogleMap>
        </div>
        <div className="absolute bottom-2 left-70">
          <button
            className="rounded-full bg-yellow-300 p-5 font-bold"
            onClick={() => setIsFirstViewModal(true)}
          >
            ＋
          </button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
