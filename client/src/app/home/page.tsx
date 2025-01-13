"use client";

import { useEffect, useState } from "react";

const HomePage = () => {
  const [user, setUser] = useState<{
    username: string;
    userIcon: string;
  } | null>(null);

  // `/me` エンドポイントからユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("ユーザー情報の取得に失敗しました");
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      }
    };

    fetchUser();
  }, []);

  // ユーザー情報がない場合は「読み込み中」と表示
  if (!user) {
    return <p>読み込み中...</p>;
  }

  // ユーザー情報が取得できた場合は表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          ようこそ、{user.username} さん！
        </h1>
        {user.userIcon && (
          <img
            src={user.userIcon}
            alt="User Icon"
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
        )}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          onClick={() => {
            document.cookie =
              "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            window.location.href = "/login";
          }}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default HomePage;
