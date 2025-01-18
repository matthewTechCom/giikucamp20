"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { logIn } from "../../utils/apiUtils";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [userIcon, setUserIcon] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // エラーをリセット
    try {
      // ログイン処理
      const user = await logIn(username, password);
      setUser({
        id: user.id,
        username: user.username,
        userIcon: user.userIcon,
      });
      setUserIcon(user.userIcon); // ユーザーアイコンを設定
      alert("ログイン成功！");
      router.push("/home");
    } catch (error) {
      console.error("ログインエラー:", error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("ログインに失敗しました。");
      }
    }
  };

  return (
    <div
      className="relative min-h-screen bg-center bg-cover text-white"
      style={{ backgroundImage: "url('/models/mapimage.png')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-4xl font-bold mb-8">MapChat</div>
        <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>

          {userIcon && (
            <div className="flex justify-center mb-6">
              <img
                src={userIcon}
                alt="User Icon"
                className="w-16 h-16 rounded-full border border-white"
              />
            </div>
          )}

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
            <label className="block mb-4">
              <span className="block mb-2">ユーザー名</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 p-2 w-full border rounded text-black"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-2">パスワード</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-2 w-full border rounded text-black"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded text-center transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
