"use client";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY as string;

const HomePage = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  // Google Maps のスタイルと座標設定
  const containerStyle: React.CSSProperties = {
    width: "400px",
    height: "900px",
  };

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

  if (loadError) {
    return <div>地図を読み込めませんでした。</div>;
  }

  if (!isLoaded) {
    return <div>地図を読み込んでいます...</div>;
  }

  if (!user) {
    setUser({
      id: 1,
      username: "もち",
      userIcon: "",
    });
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        ログインしてください。
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="rounded shadow-md w-96 ">
        <div className="flex p-4 bg-black bg-opacity-80 text-slate-100 justify-between">
        <h1 className="text-2xl font-bold ">MapChat</h1>
        <Image
          src={user.userIcon || "/default-icon.png"}
          alt="ユーザーアイコン"
          width={36}
          height={36}
          className="rounded-full"
        />
        </div>
        <div className="flex items-center justify-center">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
            <Marker
              position={positionAkiba}
              label={"秋葉原"}
              icon={{
                url: "https://lamp-ramp.com/wp-content/uploads/2023/08/keii01-1024x1024.png",
                scaledSize: new google.maps.Size(50, 50), // `google` オブジェクトが存在する状態で実行
              }}
              onClick={handleChangeURL}
            />
            <Marker position={center} label={"テスト1"} />
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
