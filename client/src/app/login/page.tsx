"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { logIn } from "../../utils/apiUtils";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await logIn(username, password);
      setUser({
        id: user.id,
        username: user.username,
        userIcon: user.userIcon,
      });
      alert("ログイン成功！");
      router.push("/home");
    } catch (error) {
      const errorMessage =
        (error as Error).message || "ログインに失敗しました。";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          style={{
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            MapChat
          </span>
        </h1>
      </div>

      {/* ログインフォーム */}
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-80 rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">
          ログイン
        </h2>
        {errorMessage && (
          <div
            className="mb-4 text-red-500 text-sm bg-red-200 bg-opacity-20 p-3 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              placeholder="ユーザー名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              パスワード
            </label>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            {isLoading ? "処理中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
