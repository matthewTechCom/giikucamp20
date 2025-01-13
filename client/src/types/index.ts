// ユーザー情報の型定義
export type UserInfo = {
  username: string;
  token: string;
  userIcon: string;
};

// チャットメッセージの型定義
export type ChatMessage =
  | {
      type: "JOIN";
      username: string;
      text?: string;
    }
  | {
      type: "LEAVE";
      username: string;
      text?: string;
    }
  | {
      type: "MSG";
      username: string;
      text: string;
    }
  | {
      type: "FILE";
      username: string;
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
};
