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
    <div
      className="relative min-h-screen bg-center bg-cover text-white"
      style={{ backgroundImage: "url('/models/mapimage2.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-4xl font-bold mb-8 text-yellow-400">MapChat</div>
        <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6 text-center">Sign Up</h2>

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
            <label className="block mb-4">
              <span className="block mb-2">User Name</span>
              <input
                type="text"
                placeholder="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 p-2 w-full border rounded text-black"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-2">Password</span>
              <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-2 w-full border rounded text-black"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-2">User Icon</span>

              <div className="border-2 border-dashed border-gray-300 rounded p-4 flex items-center justify-center cursor-pointer bg-gray-100">
                <input
                  type="file"
                  onChange={(e) =>
                    setUserIcon(e.target.files ? e.target.files[0] : null)
                  }
                  className="text-black"
                  accept="image/*"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded text-center transition-colors"
            >
              {isLoading ? "処理中..." : "サインアップ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
