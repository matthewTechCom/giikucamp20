"use client";

import { UserContext } from "@/context/UserContext";
import { fetchUser } from "@/utils/apiUtils";
import { faLocationPin, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function HomePage() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        try {
          const userData = await fetchUser();
          setUser(userData);
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました", error);
        }
      }
    };
    loadUser();
  }, [user, setUser]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        ログインしてください。
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-slate-100">
      {/* 背景画像 */}
      <div className="absolute inset-0 -z-10">
        <Image
          alt="background"
          src="/images/background.png"
          quality={100}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* タイトル */}
      <div className="text-center mb-12">
        <h1
          className="text-6xl font-extrabold mb-6 text-white drop-shadow-lg"
          style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            MapChat
          </span>
        </h1>
      </div>

      {/* メインコンテンツ */}
      <div className="w-full max-w-3xl bg-gray-800 bg-opacity-80 rounded-xl p-10 shadow-xl">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <button
              className="bg-yellow-300 text-black text-4xl rounded-xl p-6 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              onClick={() => router.push("/create-room")}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <p className="mt-4 text-lg font-semibold text-gray-200">
              ルームを作成
            </p>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="bg-yellow-300 text-black text-4xl rounded-xl p-6 shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              onClick={() => router.push("/search-room")}
            >
              <FontAwesomeIcon icon={faLocationPin} />
            </button>
            <p className="mt-4 text-lg font-semibold text-gray-200">
              ルームに参加
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
