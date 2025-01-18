"use client";

import { ThreeModel } from "@/components/ThreeModel";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 to-red-300">
      <ThreeModel />

      {/* タイトルのアニメーション */}
      <h1
        className="text-6xl font-extrabold text-white mb-8"
        style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
      >
        <span
          className="inline-block animate-pulse delay-1000 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          style={{ animationDuration: "2s" }}
        >
          M
        </span>
        <span
          className="inline-block animate-pulse delay-1100 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-500 to-orange-500"
          style={{ animationDuration: "2.2s" }}
        >
          a
        </span>
        <span
          className="inline-block animate-pulse delay-1200 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-purple-600"
          style={{ animationDuration: "2.4s" }}
        >
          p
        </span>
        <span
          className="inline-block animate-pulse delay-1300 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-indigo-500 to-purple-600"
          style={{ animationDuration: "2.6s" }}
        >
          C
        </span>
        <span
          className="inline-block animate-pulse delay-1400 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-500 to-green-500"
          style={{ animationDuration: "2.8s" }}
        >
          h
        </span>
        <span
          className="inline-block animate-pulse delay-1500 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-500 to-purple-600"
          style={{ animationDuration: "3s" }}
        >
          a
        </span>
        <span
          className="inline-block animate-pulse delay-1600 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-500"
          style={{ animationDuration: "3.2s" }}
        >
          t
        </span>
      </h1>

      {/* 説明テキスト */}
      <p className="text-xl font-bold text-white mb-6 animate__animated animate__fadeIn animate__delay-2s">
        あなたの場所とチャットをつなげる新しい体験を！
      </p>

      {/* ボタン */}
      <div className="flex justify-center gap-6 animate__animated animate__fadeIn animate__delay-3s">
        <Link
          href="/signup"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
        >
          サインアップ
        </Link>
        <Link
          href="/login"
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-transform transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300"
        >
          ログイン
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
