package model

import "github.com/gorilla/websocket"

type Client struct {
	Username string
	UserIcon string
	Conn     *websocket.Conn
	Send     chan *Message
	Hub      *Hub
}
