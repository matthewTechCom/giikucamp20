package model

type Hub struct {
	RoomName     string
	Password     string
	Clients      map[*Client]bool
	Broadcast    chan *Message
	Register     chan *Client
	Unregister   chan *Client
	Close        chan bool
	PastMessages []*Message
}

func NewHub(roomName string, password string) *Hub {
	return &Hub{
		RoomName:     roomName,
		Password:     password,
		Clients:      make(map[*Client]bool),
		Broadcast:    make(chan *Message),
		Register:     make(chan *Client),
		Unregister:   make(chan *Client),
		Close:        make(chan bool),
		PastMessages: make([]*Message, 0),
	}
}
