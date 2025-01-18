// src/pages/Chat.tsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatMessage, SetUserMessage } from "@/types";
import Message from "@/components/Message";
import { FaFileImport } from "react-icons/fa";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    if (!roomName || !password) {
      navigate("/rooms");
      return;
    }

    const fetchUserAndConnect = async () => {
      try {
        // 1) ユーザー情報をバックエンドから取得
        const res = await axios.get<UserResponse>(
          "http://localhost:8080/getuserinfo"
        );
        // res.data が UserResponse であることを TS に伝えて格納
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
                // userIcon が undefined の場合、'' に置き換え
                const icon = userIcon ?? "";
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "MSG",
                    username,
                    userIcon: icon, // ここは必ず string
                    text,
                  },
                ]);
                break;
              }

              case "FILE": {
                const { username, userIcon, fileUrl, fileName } = msg;
                // userIcon が undefined の場合、'' に置き換え
                const icon = userIcon ?? "";
                setMessages((prev) => [
                  ...prev,
                  {
                    type: "FILE",
                    username,
                    userIcon: icon, // ここも必ず string
                    fileUrl,
                    fileName,
                  },
                ]);
                break;
              }
              case "JOIN": {
                // JOIN メッセージの場合
                const { username, userIcon, text } = msg;
                setJoinedUsers((prev) => {
                  const exists = prev.some((u) => u.username === username);
                  if (!exists) {
                    // userIcon が undefined の場合、空文字に置換
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
                // LEAVE メッセージの場合
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
                // ERROR メッセージの場合
                const { message } = msg;
                alert(`エラー: ${message}`);
                navigate("/rooms");
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
        navigate("/rooms");
      }
    };

    fetchUserAndConnect();

    // クリーンアップ
    return () => {
      socketRef.current?.close();
    };
  }, [navigate, roomName, password]);

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // メッセージ送信処理
  const handleSend = async () => {
    // WebSocket 未接続の場合
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert("WebSocketが接続されていません");
      return;
    }
    // ユーザー情報が無い場合
    if (!user) {
      alert("ユーザー情報を取得できていません");
      return;
    }
    // 入力もファイルも無い場合
    if (!inputText.trim() && !selectedFile) return;

    // 1) テキストメッセージ
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

    // 2) ファイルアップロード
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // /upload から返ってくる url の型をアサート
        const response = await axios.post<UploadResponse>(
          "http://localhost:8080/upload",
          formData
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
    navigate("/rooms");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-gray-800 text-white py-3 px-6 flex items-center">
        <span className="text-xl font-bold">{roomName}</span>
        <button
          onClick={handleLeave}
          className="ml-auto bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          <TbLogout2 size={25} />
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
              className="object-cover rounded-full border border-gray-300"
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
      <div className="bg-white border-t border-gray-300 p-3">
        <div className="flex items-center">
          <label htmlFor="file-input" className="mr-2 cursor-pointer">
            <FaFileImport className="text-2xl text-gray-600 hover:text-gray-800" />
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
              className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
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
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
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
