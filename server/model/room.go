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
