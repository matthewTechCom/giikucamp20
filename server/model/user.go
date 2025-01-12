package model

type User struct {
	ID       int    `json:"id"`
	Username string `json:"userName"`
	UserIcon string `json:"usericon"`
}
