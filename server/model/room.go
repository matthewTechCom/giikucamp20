package model

type Room struct {
	ID        int    `json:"id"`
	RoomImage string `json:"roomImage"`
	RoomName  string `json:"roomName"`
	Password  string `json:"password"`
}
