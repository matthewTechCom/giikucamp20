"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../../utils/apiUtils";
import Image from "next/image";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userIcon, setUserIcon] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // エラーメッセージ
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // ローディング開始
    setErrorMessage(null); // エラーリセット

    try {
      await signUp(username, password, userIcon);
      alert("サインアップ成功！");
      setUsername(""); // フォームのリセット
      setPassword("");
      setUserIcon(null);
      router.push("/login");
    } catch (error) {
      console.error("SignUp Error:", error);
      const errorMessage =
        (error as Error).message || "サインアップに失敗しました。";
      setErrorMessage(errorMessage); // エラーメッセージを設定
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
          <form onSubmit={handleSignUp}>
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
            <div className="mb-10">
              <label className="block mb-2 font-bold">ユーザーアイコン</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 bg-gray-100">
                <input
                  type="file"
                  placeholder="ユーザーアイコン"
                  onChange={(e) =>
                    setUserIcon(e.target.files ? e.target.files[0] : null)
                  }
                  className="text-black"
                  accept="image/*"
                />
              </div>
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

export default SignUpPage;
