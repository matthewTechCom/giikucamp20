package model

import "time"

// ユーザーモデル（DBに保存するための構造体）
// ユーザーモデル（DBに保存するための構造体）
type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"unique;not null" json:"username"`
	Password  string    `gorm:"not null" json:"password"`
	UserIcon  string    `gorm:"column:user_icon" json:"userIcon"` // カラム名に合わせて変更
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}


// ユーザー情報のレスポンス用構造体（クライアントに返すデータ）
type UserResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	UserIcon string `json:"userIcon"`  // クライアントに返すときにユーザーアイコンも含める
}
