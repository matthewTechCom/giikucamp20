"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../../utils/apiUtils";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userIcon, setUserIcon] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // ローディング開始
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
      alert(errorMessage);
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
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
        />
        <input
          type="file"
          onChange={(e) =>
            setUserIcon(e.target.files ? e.target.files[0] : null)
          }
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={isLoading} // ローディング中はボタンを無効化
        >
          {isLoading ? "処理中..." : "サインアップ"}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
