// サインアップ/ログインのレスポンス型
export interface AuthResponse {
  id: number;
  // email: string;
  username: string;
  userIcon: string; // サーバーが返すフィールド名に合わせる
}

// ✅ ユーザー情報のレスポンス型を修正
export interface UserResponse {
  id: number;
  // email: string;
  username: string;
  userIcon: string; // フィールド名を統一
}

// CSRFトークンのレスポンス型
export interface CsrfResponse {
  csrf_token: string;
}

// サインアップ/ログインのレスポンス型（必要に応じて変更）
export interface AuthResponse {
  message: string;
}

// チャットメッセージの型定義
export type ChatMessage =
  | {
      type: "JOIN";
      username: string;
      /**
       * userIcon を必ず送らないケースがあるならオプションにする
       * （サーバーで必ず送ってくるなら string でOK）
       */
      userIcon?: string;
      text?: string;
    }
  | {
      type: "LEAVE";
      username: string;
      userIcon?: string;
      text?: string;
    }
  | {
      type: "MSG";
      username: string;
      userIcon?: string;
      text: string;
    }
  | {
      type: "FILE";
      username: string;
      userIcon?: string;
      fileUrl: string;
      fileName: string;
    }
  | {
      type: "ERROR";
      message: string;
    }
  | {
      type: "SYSTEM";
      text: string;
    }
  | {
      type: "SET_USER";
      username: string;
      userIcon?: string;
    };

// 型ガード関数の定義
export function isJoinMessage(msg: ChatMessage): msg is {
  type: "JOIN";
  username: string;
  text?: string;
} {
  return msg.type === "JOIN";
}

export function isLeaveMessage(msg: ChatMessage): msg is {
  type: "LEAVE";
  username: string;
  text?: string;
} {
  return msg.type === "LEAVE";
}

export function isMsgMessage(msg: ChatMessage): msg is {
  type: "MSG";
  username: string;
  text: string;
} {
  return msg.type === "MSG";
}

export function isFileMessage(msg: ChatMessage): msg is {
  type: "FILE";
  username: string;
  fileUrl: string;
  fileName: string;
} {
  return msg.type === "FILE";
}

export function isErrorMessage(msg: ChatMessage): msg is {
  type: "ERROR";
  message: string;
} {
  return msg.type === "ERROR";
}

export function isSystemMessage(msg: ChatMessage): msg is {
  type: "SYSTEM";
  text: string;
} {
  return msg.type === "SYSTEM";
}

export function isSetUserMessage(msg: ChatMessage): msg is {
  type: "SET_USER";
  username: string;
} {
  return msg.type === "SET_USER";
}

// "SET_USER" メッセージの型
export type SetUserMessage = {
  type: "SET_USER";
  username: string;
  userIcon: string;
};
