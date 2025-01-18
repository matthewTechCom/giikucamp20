"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../../utils/apiUtils";

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
      // サインアップAPI呼び出し
      await signUp(username, password, userIcon);
      alert("サインアップ成功！");
      setUsername(""); // フォームリセット
      setPassword("");
      setUserIcon(null);
      router.push("/login");
    } catch (error) {
      console.error("SignUp Error:", error);
      // エラーメッセージを設定
      const errorMessage =
        (error as Error).message || "サインアップに失敗しました。";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false); // ローディング終了
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">サインアップ</h1>
        {errorMessage && (
          <div
            className="mb-4 text-red-500 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
        <label htmlFor="username" className="block mb-1 text-sm font-semibold">
          ユーザー名
        </label>
        <input
          id="username"
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
          aria-label="ユーザー名"
          required
        />
        <label htmlFor="password" className="block mb-1 text-sm font-semibold">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
          aria-label="パスワード"
          required
        />
        <label htmlFor="userIcon" className="block mb-1 text-sm font-semibold">
          プロフィール画像
        </label>
        <input
          id="userIcon"
          type="file"
          onChange={(e) =>
            setUserIcon(e.target.files ? e.target.files[0] : null)
          }
          className="mb-4"
          aria-label="プロフィール画像"
          accept="image/*"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={isLoading} // ローディング中はボタンを無効化
          aria-label="サインアップボタン"
        >
          {isLoading ? "処理中..." : "サインアップ"}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
