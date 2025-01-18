"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { logIn } from "../../utils/apiUtils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
<<<<<<< HEAD
      const user = await logIn(username, password);
=======
      // ✅ ログイン処理
      const user = await logIn(email, password);
>>>>>>> fad34c9648d464930c8be022e83d9a85e1213e6e
      setUser({
        id: user.id,
        username: user.username,
        userIcon: user.userIcon || null, // undefined の場合は null を設定
      });

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
<<<<<<< HEAD
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">ログイン</h1>
        {errorMessage && (
          <div
            className="mb-4 text-red-500 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
        <input
=======
    <div className="relative min-h-screen bg-center bg-cover text-white"
    style={{ backgroundImage: "url('../../public/models/mapimage.png')"}}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-4xl font-bold mb-8">MapChat</div>
        <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
            )}
          <label className="block mb-4">
          <span className="block mb-2">Email</span>
          <input
>>>>>>> fad34c9648d464930c8be022e83d9a85e1213e6e
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
<<<<<<< HEAD
          aria-label="ユーザー名"
          required
        />
        <input
          type="password"
=======
          />           
          </label>

          <label className="block mb-4">
          <span className="block mb-2">Password</span>
          <input
          type="text"
>>>>>>> fad34c9648d464930c8be022e83d9a85e1213e6e
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
<<<<<<< HEAD
          aria-label="パスワード"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          aria-label="ログインボタン"
=======
          />           
          </label>

        <button
        type="submit"
        className="
          w-full py-2 text-white 
          bg-yellow-500 hover:bg-yellow-600 
          rounded text-center transition-colors
        "
>>>>>>> fad34c9648d464930c8be022e83d9a85e1213e6e
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
