"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { logIn } from "../../utils/apiUtils";
import Image from "next/image";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // ローディング開始
    setErrorMessage(null); // エラーをリセット
    try {
      // ログイン処理
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
      setIsLoading(false); // ローディング終了
    }
  };

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
      <div className="flex w-full justify-between px-4 mb-4">
        <h2 className="text-2xl font-bold">ユーザー登録</h2>
      </div>
      <div className="mx-4 bg-white bg-opacity-20 rounded-2xl p-10 backdrop-blur-sm shadow-lg border-white border-opacity-20 border">
        <div className="flex flex-col">
          {errorMessage && (
            <div
              className="mb-4 text-red-500 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-1 font-bold">ユーザー名</label>
              <input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-bold">パスワード</label>
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-black"
                required
              />
            </div>
            <div className="flex justify-center gap-5">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold"
              >
                {isLoading ? "処理中..." : "サインアップ"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
