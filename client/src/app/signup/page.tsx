"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../../utils/apiUtils";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userIcon, setUserIcon] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // ローディング開始
    try {
      await signUp(email, password, username, userIcon);
      alert("サインアップ成功！");
      setEmail("");
      setPassword("");
      setUsername(""); // フォームのリセット      
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
    <div className="relative min-h-screen bg-center bg-cover text-white"
    style={{ backgroundImage: "url('../../public/models/mapimage.png')"}}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-4xl font-bold mb-8">MapChat</div>
        <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-6 text-center">SignUp</h2>
          <form onSubmit={handleSignUp}>
            <label className="block mb-4">
            <span className="block mb-2">Email</span>
            <input
            type="text"
            placeholder="パスワード"
            value={email}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 w-full border rounded"
            />           
            </label>



            <label className="block mb-4">
            <span className="block mb-2">Password</span>
            <input
            type="text"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 w-full border rounded"
            />           
            </label>

            <label className="block mb-4">
            <span className="block mb-2">UserName</span>
            <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-2 w-full border rounded"
            />           
            </label>

            <label className="block mb-4">
              <span className="block mb-2">userIcon</span>
              <div className="border-2 border-dashed border-gray-300 rounded p-4 flex items-center justify-center cursor-pointer bg-gray-100">
              <input
              type="file"
              onChange={(e) =>
                setUserIcon(e.target.files ? e.target.files[0] : null)
              }
              className="text-black"
              />
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-2 text-white 
                bg-yellow-500 hover:bg-yellow-600 
                rounded text-center transition-colors
              "
            >
              {isLoading ? "処理中..." : "サインアップ"}
            </button>
          </form>
        </div>
      </div>
    </div>









    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <form
    //     onSubmit={handleSignUp}
    //     className="bg-white p-8 rounded shadow-md w-96"
    //   >
    //     <h1 className="text-2xl font-bold mb-6">サインアップ</h1>
    //     <input
    //       type="text"
    //       placeholder="ユーザー名"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       className="mb-4 p-2 w-full border rounded"
    //     />
    //     <input
    //       type="password"
    //       placeholder="パスワード"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       className="mb-4 p-2 w-full border rounded"
    //     />
    //     <input
    //       type="file"
    //       onChange={(e) =>
    //         setUserIcon(e.target.files ? e.target.files[0] : null)
    //       }
    //       className="mb-4"
    //     />
    //     <button
    //       type="submit"
    //       className="bg-blue-500 text-white py-2 px-4 rounded w-full"
    //       disabled={isLoading} // ローディング中はボタンを無効化
    //     >
    //       {isLoading ? "処理中..." : "サインアップ"}
    //     </button>
    //   </form>
    // </div>
  );
};

export default SignUpPage;
