"use client";

import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const HomePage = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        ログインしてください。
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">ホーム画面</h1>
        <Image
          src={user.userIcon || "/default-icon.png"} // デフォルトアイコンの設定
          alt="ユーザーアイコン"
          width={96}
          height={96}
          className="rounded-full mx-auto mb-4"
        />
        <p className="text-center text-lg">{user.username}</p>
      </div>
    </div>
  );
};

export default HomePage;
