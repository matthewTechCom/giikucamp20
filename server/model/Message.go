package model

type Message struct {
	Type     string `json:"type"`     // "CREATE_ROOM", "JOIN_ROOM", "MSG", "JOIN", "SET_USER", "ERROR"
	Username string `json:"username"` // ユーザー名
	UserIcon string `json:"userIcon"`
	Password string `json:"password"`
	RoomName string `json:"roomName"`
	Text     string `json:"text"`               // メッセージ本文
	Message  string `json:"message"`            // エラーメッセージ
	FileURL  string `json:"fileUrl,omitempty"`  // ファイルのURL（オプション）
	FileName string `json:"fileName,omitempty"` // ファイル名（オプション）
}
