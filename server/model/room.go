package model

import "time"

type Room struct {
	ID          int       `json:"id"`
	RoomImage   string    `json:"roomImage"`
	RoomName    string    `json:"roomName"`
	Password    string    `json:"password"`
	Description string    `json:"description"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	CreatedAt   time.Time `json:"created_at"`
}

// 部屋情報のレスポンス用構造体（クライアントに返すデータ）
type RoomResponse struct {
	ID       uint   `json:"id"`
	Roomname string `json:"roomname"`
	RoomIcon string `json:"roomIcon"` // クライアントに返すときにユーザーアイコンも含める
}
