import React, { useState } from "react";

interface AuthFormProps {
  type: "login" | "signup";
  onSubmit: (data: {
    username: string;
    password: string;
    usericon?: string;
  }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usericon, setUsericon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // サインアップ時のアイコンが空の場合は`undefined`にする
    const userIconData = usericon.trim() ? usericon : undefined;
    onSubmit({ username, password, usericon: userIconData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md"
    >
      <h2 className="text-2xl font-bold mb-4">
        {type === "login" ? "ログイン" : "サインアップ"}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          ユーザー名
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          パスワード
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {type === "signup" && (
        <div className="mb-4">
          <label
            htmlFor="usericon"
            className="block text-sm font-medium text-gray-700"
          >
            ユーザーアイコン（任意）
          </label>
          <input
            type="text"
            id="usericon"
            value={usericon}
            onChange={(e) => setUsericon(e.target.value)}
            placeholder="https://example.com/icon.png"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        {type === "login" ? "ログイン" : "サインアップ"}
      </button>
    </form>
  );
};

export default AuthForm;
