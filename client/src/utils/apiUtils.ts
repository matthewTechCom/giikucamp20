const API_URL = process.env.API_URL || "http://localhost:8080";

// ✅ CSRFトークンの取得
export const getCsrfToken = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/csrf`, {
      credentials: "include", // Cookieを送信
    });

    if (!response.ok) {
      throw new Error(
        `CSRFトークンの取得に失敗しました: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.csrf_token;
  } catch (error) {
    console.error("CSRFトークン取得エラー:", error);
    throw error;
  }
};

// ✅ サインアップ処理
export const signUp = async (
  username: string,
  password: string,
  userIcon: File | null
): Promise<void> => {
  try {
    const csrfToken = await getCsrfToken();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    if (userIcon) {
      formData.append("usericon", userIcon);
    }

    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      body: formData,
      credentials: "include", // Cookieを送信
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `サインアップエラー: ${errorData.message || response.statusText}`
      );
    }

    console.log("サインアップ成功");
  } catch (error) {
    console.error("サインアップエラー:", error);
    throw error;
  }
};

// ユーザー情報の型定義
export interface UserResponse {
  id: number;
  username: string;
  userIcon?: string; // ユーザーアイコンが必須でない場合
}

export const logIn = async (
  username: string,
  password: string
): Promise<UserResponse> => {
  try {
    const csrfToken = await getCsrfToken();

    // ログインリクエスト
    const loginResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Cookieを送信
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      throw new Error(
        `ログインエラー: ${errorData.message || loginResponse.statusText}`
      );
    }

    // ユーザー情報取得リクエスト
    const userResponse = await fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include", // Cookieも送信
    });

    if (!userResponse.ok) {
      throw new Error(`ユーザー情報取得エラー: ${userResponse.statusText}`);
    }

    const userData: UserResponse = await userResponse.json();
    console.log("ログイン成功:", userData);
    return userData;
  } catch (error) {
    console.error("ログインエラー:", error);
    throw error;
  }
};
