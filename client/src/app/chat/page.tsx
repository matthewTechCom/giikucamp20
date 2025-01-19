// src/pages/Chat.tsx
"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaFileImport } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { getCsrfToken } from "@/utils/apiUtils";

// Next.js のルーターと検索パラメータ取得フックを使用
import { useRouter, useSearchParams } from "next/navigation";

import Message from "@/components/Message";
import { ChatMessage, SetUserMessage } from "@/types";

type UserResponse = {
  username: string;
  userIcon: string;
};

/**
 * /upload のレスポンス想定
 * 例: { url: string; } だけを受け取る場合
 */
type UploadResponse = {
  url: string;
};

const Chat: React.FC = () => {
  // useRouter で画面遷移を制御
  const router = useRouter();
  // useSearchParams で URL 検索パラメータを取得
  const searchParams = useSearchParams();
  const roomName = searchParams.get("room") || "";
  const password = searchParams.get("password") || "";

  // バックエンドから取得したユーザー情報を保持するためのステート
  const [user, setUser] = useState<UserResponse | null>(null);

  // 参加中のユーザー一覧
  const [joinedUsers, setJoinedUsers] = useState<
    { username: string; userIcon: string }[]
  >([]);
  // チャットメッセージ一覧
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 送信テキスト
  const [inputText, setInputText] = useState("");
  // 選択されたファイル
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // roomName / password が無い場合はホームにリダイレクト
    if (!roomName || !password) {
      router.push("/home");
      return;
    }

    const fetchUserAndConnect = async () => {
      try {
        // 1) ユーザー情報をバックエンドから取得
        const res = await axios.get<UserResponse>("http://localhost:8080/me", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 必要に応じてクッキーを送信
        });

        if (!res.data || !res.data.username || !res.data.userIcon) {
          throw new Error("不正なユーザー情報が返されました");
        }
        setUser(res.data);

        // 2) WebSocket 接続
        const wsUrl = `ws://localhost:8080/rooms/${encodeURIComponent(
          roomName
        )}/ws?password=${encodeURIComponent(password)}`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("WebSocket connected");

          // 3) SET_USER メッセージを送信
          const setUserMessage: SetUserMessage = {
            type: "SET_USER",
            username: res.data.username,
            userIcon: res.data.userIcon,
          };
          socket.send(JSON.stringify(setUserMessage));
        };

        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data) as ChatMessage;

            switch (msg.type) {
              case "MSG": {
                const { username, userIcon, text } = msg;
                const icon = userIcon ?? "";
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "MSG",
                    username,
                    userIcon: icon,
                    text,
                  },
                ]);
                break;
              }

              case "FILE": {
                const { username, userIcon, fileUrl, fileName } = msg;
                const icon = userIcon ?? "";
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "FILE",
                    username,
                    userIcon: icon,
                    fileUrl,
                    fileName,
                  },
                ]);
                break;
              }
              case "JOIN": {
                const { username, userIcon, text } = msg;
                setJoinedUsers((prev) => {
                  const exists = prev.some((u) => u.username === username);
                  if (!exists) {
                    const icon = userIcon ?? "";
                    return [...prev, { username, userIcon: icon }];
                  }
                  return prev;
                });
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "SYSTEM",
                    text: text || `${username} が参加しました。`,
                  },
                ]);
                break;
              }
              case "LEAVE": {
                const { username, text } = msg;
                setJoinedUsers((prev) =>
                  prev.filter((u) => u.username !== username)
                );
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "SYSTEM",
                    text: text || `${username} が退室しました。`,
                  },
                ]);
                break;
              }

              case "ERROR": {
                const { message } = msg;
                alert(`エラー: ${message}`);
                router.push("/home");
                break;
              }
              default:
                console.warn("Unknown message type:", msg.type);
            }
          } catch (err) {
            console.error("Failed to parse message:", err);
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
          alert("WebSocketでエラーが発生しました");
        };

        socket.onclose = () => {
          console.log("WebSocket closed");
          setMessages((prev) => [
            ...prev,
            { type: "SYSTEM", text: "接続が切断されました。" },
          ]);
        };
      } catch (error) {
        console.error("Failed to fetch user info or connect websocket:", error);
        alert("ユーザー情報の取得、またはWebSocket接続に失敗しました。");
        router.push("/home");
      }
    };

    fetchUserAndConnect();

    // クリーンアップ
    return () => {
      socketRef.current?.close();
    };
  }, []);

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // メッセージ送信処理
  const handleSend = async () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("WebSocketが接続されていません");
      return;
    }
    if (!user) {
      alert("ユーザー情報を取得できていません");
      return;
    }
    if (!inputText.trim() && !selectedFile) return;

    // テキストメッセージ送信
    if (inputText.trim()) {
      socketRef.current.send(
        JSON.stringify({
          type: "MSG",
          username: user.username,
          userIcon: user.userIcon,
          text: inputText.trim(),
        })
      );
      setInputText("");
    }

    // ファイル送信
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        console.log(selectedFile);
        const csrfToken = await getCsrfToken();
        const response = await axios.post<UploadResponse>(
          "http://localhost:8080/upload",
          formData,
          {
            withCredentials: true,
            headers: {
              "X-CSRF-Token": csrfToken, // CSRFトークンをヘッダーに追加
            },
          }
        );
        const fileUrl = response.data.url;

        socketRef.current.send(
          JSON.stringify({
            type: "FILE",
            username: user.username,
            userIcon: user.userIcon,
            fileUrl,
            fileName: selectedFile.name,
          })
        );
        setSelectedFile(null);
      } catch (error) {
        console.error("ファイルアップロードエラー:", error);
        alert("ファイルのアップロードに失敗しました");
      }
    }
  };

  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 退室ボタン
  const handleLeave = () => {
    socketRef.current?.close();
    router.push("/home");
  };

  return (
    <div
      className="
        flex flex-col 
        h-screen 
        bg-gradient-to-b 
        from-green-100 
        via-blue-100 
        to-blue-200
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-neutral-800 py-2 px-4 shadow">
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="inline-block animate-pulse delay-1000 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {roomName}
          </span>
        </h1>
        <button
          onClick={handleLeave}
          className="ml-auto hover:bg-red-600 px-4 py-2 rounded-lg bg-yellow-300"
        >
          <TbLogout2 size={25} className="text-black" />
        </button>
      </div>

      {/* User Icons */}
      <div className="bg-gray-100 border-b border-gray-300 p-3 flex space-x-3 overflow-x-auto">
        {joinedUsers.map((u, idx) => (
          <div key={idx} className="relative">
            <Image
              src={u.userIcon}
              alt={`${u.username} icon`}
              width={40}
              height={40}
              className="object-cover rounded-full border border-gray-300 aspect-square"
            />
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <Message key={idx} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-black border-t border-gray-300 p-3 py-4 bg-opacity-80">
        <div className="flex items-center">
          <label htmlFor="file-input" className="mr-2 cursor-pointer">
            <FaFileImport className="text-2xl text-yellow-300 hover:text-yellow-400 mx-2" />
          </label>
          <input
            id="file-input"
            type="file"
            accept="*/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {selectedFile && <span className="mr-2">{selectedFile.name}</span>}

          <div className="flex-1 flex">
            <input
              className="flex-1 border-gray-300 rounded-l px-3 py-2 focus:outline-none"
              placeholder="メッセージを入力..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              className="bg-yellow-300 text-black px-4 py-2 rounded-r hover:bg-yellow-400"
            >
              <IoIosSend size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
