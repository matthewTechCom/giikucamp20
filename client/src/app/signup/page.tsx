"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import { signupUser } from "../../utils/apiUtils";

const SignupPage = () => {
  const router = useRouter();

  // サインアップ処理
  const handleSignup = async (data: {
    username: string;
    password: string;
    usericon?: string;
  }) => {
    try {
      await signupUser(data);
      alert("サインアップ成功！");
      router.push("/login"); // サインアップ成功時にログインページにリダイレクト
    } catch (error) {
      alert("サインアップ失敗: " + (error as Error).message);
    }
  };

  // AuthForm コンポーネントを使用してサインアップフォームをレンダリング
  return <AuthForm type="signup" onSubmit={handleSignup} />;
};

export default SignupPage;
