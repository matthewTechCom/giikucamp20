'use client'

import { ThreeModel } from "@/components/ThreeModel";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-300 to-red-400">
      <ThreeModel />
      {/* タイトルのアニメーション */}
      <h1 className="text-6xl font-extrabold text-white mb-8">
        <span className="inline-block animate-bounce delay-1000">M</span>
        <span className="inline-block animate-bounce delay-1100">a</span>
        <span className="inline-block animate-bounce delay-1200">p</span>
        <span className="inline-block animate-bounce delay-1300">C</span>
        <span className="inline-block animate-bounce delay-1400">h</span>
        <span className="inline-block animate-bounce delay-1500">a</span>
        <span className="inline-block animate-bounce delay-1600">t</span>
      </h1>

      {/* 説明テキスト */}
      <p className="text-xl text-white mb-6 animate__animated animate__fadeIn animate__delay-2s">
        ここの見出しの文章を考えてほしい！
      </p>

      {/* ボタン */}
      <div className="flex justify-center gap-6 animate__animated animate__fadeIn animate__delay-3s">
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-700"
        >
          サインアップ
        </Link>
        <Link
          href="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-green-700"
        >
          ログイン
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
