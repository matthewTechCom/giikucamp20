// サインアップリクエスト
export const signupUser = async (data: {
  username: string;
  password: string;
  usericon?: string;
}) => {
  const response = await fetch("http://localhost:8080/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "サインアップに失敗しました");
  }

  return await response.json(); // サインアップ成功時のレスポンスを返却
};

// ログインリクエスト
export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // ✅ クッキーを送信する
  });

  if (!response.ok) {
    throw new Error("ログインに失敗しました");
  }

  const result = await response.json();
  return {
    token: result.token,
    username: result.username,
    userIcon: result.userIcon,
  };
};
