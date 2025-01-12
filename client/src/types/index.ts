export type UserInfo = {
    username: string
    userIcon: string // Base64 DataURL
  }
  
  export type ChatMessage =
    | {
        type: 'JOIN'
        username: string
        userIcon: string
        text?: string
      }
    | {
        type: 'LEAVE'
        username: string
        userIcon: string
        text?: string
      }
    | {
        type: 'MSG'
        username: string
        userIcon: string
        text: string
      }
    | {
        type: 'FILE'
        username: string
        userIcon: string
        fileUrl: string
        fileName: string
      }
    | {
        type: 'ERROR'
        message: string
      }
    | {
        type: 'SYSTEM'
        text: string
      }
    | {
        type: 'SET_USER'
        username: string
        userIcon: string
      }
  
  // 型ガード関数の定義
  export function isJoinMessage(msg: ChatMessage): msg is {
    type: 'JOIN'
    username: string
    userIcon: string
    text?: string
  } {
    return msg.type === 'JOIN'
  }
  
  export function isLeaveMessage(msg: ChatMessage): msg is {
    type: 'LEAVE'
    username: string
    userIcon: string
    text?: string
  } {
    return msg.type === 'LEAVE'
  }
  
  export function isMsgMessage(msg: ChatMessage): msg is {
    type: 'MSG'
    username: string
    userIcon: string
    text: string
  } {
    return msg.type === 'MSG'
  }
  
  export function isFileMessage(msg: ChatMessage): msg is {
    type: 'FILE'
    username: string
    userIcon: string
    fileUrl: string
    fileName: string
  } {
    return msg.type === 'FILE'
  }
  
  export function isErrorMessage(msg: ChatMessage): msg is {
    type: 'ERROR'
    message: string
  } {
    return msg.type === 'ERROR'
  }
  
  export function isSystemMessage(msg: ChatMessage): msg is {
    type: 'SYSTEM'
    text: string
  } {
    return msg.type === 'SYSTEM'
  }
  
  export function isSetUserMessage(msg: ChatMessage): msg is {
    type: 'SET_USER'
    username: string
    userIcon: string
  } {
    return msg.type === 'SET_USER'
  }
  
  export type SetUserMessage = {
    type: 'SET_USER'
    username: string
    userIcon: string
  }
  