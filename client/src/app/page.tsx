"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const IndexPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // ✅ ユーザーがログインしている場合、/home にリダイレクト
      router.replace("/home");
    } else {
      // 未ログインなら /login にリダイレクト
      router.replace("/login");
    }
  }, [user, router]);

  // リダイレクト処理のみを行うため、何も表示しない
  return <p>リダイレクト中...</p>;
};

export default IndexPage;
