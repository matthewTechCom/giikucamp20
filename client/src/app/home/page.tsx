"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin, faPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { fetchUser } from "@/utils/apiUtils";

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
    <div className="flex flex-col items-left justify-center min-h-screen bg-black text-slate-100 bg-opacity-80">
      <div className="fixed inset-0 h-screen -z-10">
        <Image
          alt="background"
          src="/images/background.png"
          quality={100}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="mx-4 mb-8 text-left">
        <h1 className="text-5xl font-bold mb-2">MapChat</h1>
        <p>
          誰でも簡単に、
          <br />
          近くの人と情報をシェア
        </p>
      </div>
      <div className="mx-4 bg-white bg-opacity-20 rounded-2xl p-10 backdrop-blur-sm shadow-lg border-white border-opacity-20 border">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
            <button
              className="bg-yellow-300 text-black text-4xl rounded-xl p-6 mb-2"
              onClick={() => router.push("/create-room")}
            >
              <FontAwesomeIcon icon={faPlus} className="aspect-square" />
            </button>
            <p className="mt-2 font-semibold">ルームを作成</p>
          </div>
          <div className="flex flex-col items-center">
            <button
              className="bg-yellow-300 text-black text-4xl rounded-xl p-6 mb-2"
              onClick={() => router.push("/search-room")}
            >
              <FontAwesomeIcon icon={faLocationPin} className="aspect-square" />
            </button>
            <p className="mt-2 font-semibold">ルームに参加</p>
          </div>
        </div>
      </div>
    </div>
  );
}
