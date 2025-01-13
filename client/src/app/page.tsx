"use client";
import { useRouter } from "next/router"; // Next.js の useRouter フックをインポート
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";

const AccountCreation: React.FC = () => {
  const [isClient, setIsClient] = useState(false); // クライアントサイドであるかを追跡
  const { setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [previewIcon, setPreviewIcon] = useState<string>(""); // プレビュー用
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsClient(true); // クライアントサイドで実行
  }, []);

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setPreviewIcon(ev.target.result); // Base64 の DataURL
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("ユーザー名を入力してください");
      return;
    }
    if (!previewIcon) {
      alert("アイコン画像を選択してください");
      return;
    }

    // Context にユーザー情報を保存
    setUser({
      username: username.trim(),
      userIcon: previewIcon, // DataURL
    });

    if (isClient) {
      const router = useRouter(); // クライアントサイドでのみ useRouter を呼び出す
      router.push("/rooms");
    }
  };

  if (!isClient) {
    return null; // サーバーサイドでは何もレンダリングしない
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">アカウント作成</h1>
        <div className="mb-4">
          <label className="block font-semibold mb-1">ユーザー名</label>
          <input
            type="text"
            className="border rounded w-full px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">アイコン画像</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleIconChange}
            className="border rounded w-full px-3 py-2"
          />
          {previewIcon && (
            <div className="mt-2">
              <img
                src={previewIcon}
                alt="preview"
                className="w-16 h-16 object-cover rounded-full"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          作成
        </button>
      </form>
    </div>
  );
};

export default AccountCreation;
