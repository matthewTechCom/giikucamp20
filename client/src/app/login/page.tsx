"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import { useUser } from "../../context/UserContext";
import { loginUser } from "../../utils/apiUtils";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const { token, username, userIcon } = await loginUser(data);

      // クッキーにトークンを保存
      document.cookie = `token=${token}; path=/;`;

      setUser({
        username,
        token,
        userIcon,
      });

      alert("ログイン成功！");
      router.replace("/home"); // ✅ '/home' に遷移させる
    } catch (error) {
      alert("ログイン失敗: " + (error as Error).message);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default LoginPage;
